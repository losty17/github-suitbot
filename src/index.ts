import { Probot } from "probot";

export default (app: Probot) => {
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });

  app.on("push", async (context) => {
    const { ref, repository, commits, pusher } = context.payload;
    const branch = ref.replace("refs/heads/", "");

    console.log(`Received push event for branch: ${branch}`);
    console.log(
      `Repository: ${repository.full_name}, default branch: ${repository.default_branch}`,
    );

    if (branch === repository.default_branch) return;

    const { data: prs } = await context.octokit.pulls.list({
      owner: repository.owner.login,
      repo: repository.name,
      head: `${repository.owner.login}:${branch}`,
      state: "open",
    });

    console.log(`Found ${prs.length} open PR(s) for branch ${branch}`);

    if (prs.length > 0) return;

    // Get last commit author
    const lastCommit = commits[commits.length - 1];
    const author = lastCommit.author.username || pusher.name;

    console.log(`Creating draft PR for branch ${branch} by author ${author}`);

    const { data: newPR } = await context.octokit.pulls.create({
      owner: repository.owner.login,
      repo: repository.name,
      title: branch,
      head: branch,
      base: repository.default_branch,
      draft: true,
      body: "Auto-generated draft PR",
    });

    console.log(`Draft PR created: #${newPR.number} - ${newPR.html_url}`);

    // Assign the author
    await context.octokit.issues.addAssignees({
      owner: repository.owner.login,
      repo: repository.name,
      issue_number: newPR.number,
      assignees: [author],
    });
  });
};
