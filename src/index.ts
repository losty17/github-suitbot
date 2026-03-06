import { Probot } from "probot";

export default (app: Probot) => {
  app.on("push", async (context) => {
    const { ref, repository, commits, pusher } = context.payload;
    const branch = ref.replace("refs/heads/", "");

    if (branch === repository.default_branch) return;

    const { data: prs } = await context.octokit.pulls.list({
      owner: repository.owner.login,
      repo: repository.name,
      head: `${repository.owner.login}:${branch}`,
      state: "open",
    });

    if (prs.length > 0) return;

    // Get last commit author
    const lastCommit = commits[commits.length - 1];
    const author = lastCommit.author.username || pusher.name;

    const { data: newPR } = await context.octokit.pulls.create({
      owner: repository.owner.login,
      repo: repository.name,
      title: branch,
      head: branch,
      base: repository.default_branch,
      draft: true,
      body: "Auto-generated draft PR",
    });

    // Assign the author
    await context.octokit.issues.addAssignees({
      owner: repository.owner.login,
      repo: repository.name,
      issue_number: newPR.number,
      assignees: [author],
    });
  });
};
