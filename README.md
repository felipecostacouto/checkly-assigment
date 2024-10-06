# Checkly Assignment

## What it does
This project demonstrates how to set up a CLI-driven Checkly workflow using GitHub Actions. The goal is to automate Playwright synthetic checks and deploy them to Checkly for monitoring and alerting via email, while keeping everything in a GitHub repository

The structure of the project was build using the checkly CLI:
```bash
npm create checkly
```

After defining where do you want to create your new project, the CLI gives you template option to use in your project, this one was using the:
```bash
An Advanced TypeScript project with multiple examples and best practices (recommended)
```

After running this commands in the CLI , I addapted the project for a github actions workflow, to automate the deployment of new synthetics to Checkly, and attend the request of the user.

if it's your first time running the an Checkly CLI project, please consult this documentation for installation, it may help developing some struture:
[Starting your first project](https://www.checklyhq.com/docs/cli/#starting-your-first-project)

## Table of Contents
- [Prerequisites](#prerequisites)
- [How to use this workflow](#how-to-use-this-workflow)
- [Customer Requirements](#customer-requirements)
- [Workflow breakdown](#workflow-breakdown)
- [Project Structure](#project-structure)

## Prerequisites

- Checkly Account
- Checkly CLI installed
- Github account
- git installed

## How to use this Workflow

1. *Repository Setup*
    - Clone ou fork this repository.
    - Ensure your Playwright test are located in the __checks__ folder

2. *Configure Secrets*

    - Please configure the CHECKLY_API_KEY and CHECKLY_ACCOUNT_ID has secrets in your github repository.

    - to create CHECKLY_API_KEY login with your account on checklyhq them:
        ```bash
        User Settings > API Keys > Create API Key
        ```

    - to access your CHECKLY_ACCOUNT_ID:
        ```bash
        Account Settings > General > Account ID
        ```

    *References*:

    - [Checkly GitHub Actions](https://www.checklyhq.com/docs/cicd/github-actions/)

    - [Using secrets in gitHub Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)

3.  *Workflow Configuration*

    - The ENVIRONMENT_URL variable in the GitHub Actions workflow is the base URL for your Playwright tests. 
    - Add new Playwright .spec.ts tests in the __checks__ folder and push your changes to the main branch to trigger the workflow.

4.  *Push Changes*:

    - Commit and push your changes to the main branch. This will trigger the GitHub Actions workflow, which runs the tests and deploys them to Checkly automatically.

5. *Monitoring*:

    - Check the Actions tab in your GitHub repository to monitor the execution of the workflow.

6. *Acess Checklyhq*:
        
    - Log in to Checkly HQ to see the newly deployed checks and monitor their execution, with alerts configured for failure notifications.

## Customer Requirements

1. **I would like to have one folder where all my Playwright tests live. If I add a new one, it should be picked up by the CLI when I deploy to Checkly.**

    - **Answer**: All Playwright tests are located in the __checks__ folder, new tests will be automatically detected by the workflow upon deployment to Checkly.The checkMatch and testMatch properties in checkly.config.ts are used to automatically include tests and checks based on the file patterns defined:
    
    - **testMatch**: Matches .spec.ts files for Browser Checks. Located on line 47.
    - **checkMatch**: Matches .check.ts files containing Checkly-specific checks. Located on line 34.

    - No manual configuration is required to add new tests; just place them in the  __checks__ folder

    - References:
        [Using check test match](https://www.checklyhq.com/docs/cli/using-check-test-match/#browsercheckstestmatch)


2. **If those checks fail, they should alert me on my email address.**

    - **Answer**: This has been configured in the **alert-channels.ts** file, the following configuration ensures that you’ll be notified by email for any check failures:

        ```bash
        const sendDefaults = {
            sendFailure: true,
            sendRecovery: true,
            sendDegraded: false,
            sslExpiry: true,
            sslExpiryThreshold: 30
        }
        export const emailChannel = new EmailAlertChannel('email-channel-1', {
            address: 'yourEmailAddress@gmail.com',
            ...sendDefaults
        })
        ``` 

    - References: 
        [alert channels](https://www.checklyhq.com/docs/alerting-and-retries/alert-channels/)

3. **Everything should live in a git repository**

    - **Answer**: All project files, including Playwright tests, Checkly configuration, alert channels, and the GitHub Actions workflow, are stored in this repository.

4. **It should be simple to deploy my synthetics to Checkly without additional setup, i.e. can I deploy my checks via a CI pipeline of some sort.**

    - **Answer**: For this particular setup, GitHub Actions is being used to trigger deployments on a push to the main branch. 

## Workflow breakdown
-  **Trigger**:

    - The workflow is set to trigger on a push event to the main branch. 
    This means that whenever you push code to the main branch, this workflow will execute

-  **Environment Variables**:

    - **CHECKLY_API_KEY**: Your Checkly API key.
    - **CHECKLY_ACCOUNT_ID**: Your Checkly account ID.
    - **ENVIRONMENT_URL**: The URL against which the checks will run

-  **jobs**:

    - The workflow contains a single job named test-e2e, which will: 
      - Run on the latest version of Ubuntu.
      - Have a timeout set for 10 minutes to prevent long-running jobs.

- **Steps**:
    1.    **Checkout Code**:
        Uses actions/checkout@v3 to fetch the code from the repository.

    2.    **Set Branch Name**:
        A workaround step that sets the CHECKLY_TEST_REPO_BRANCH environment variable to get the current branch name.

    3.    **Setup Node.js**:
        Uses actions/setup-node@v3 to set the Node.js version to 20.

    4.    **Cache Dependencies**:
        Uses actions/cache@v3 to cache the node_modules directory to speed up builds by avoiding unnecessary re-installations.
        
    5.    **Install Dependencies**:
        Installs the project dependencies using npm ci, but only if the cache was not hit in the previous step.

    6.    **Run Checks**:
            Executes the Checkly tests with the command:
            ```bash
            npx checkly -v && npx checkly test -e ENVIRONMENT_URL=${{ env.ENVIRONMENT_URL }} --reporter=github --record
            ```

    7.    **Deploy Checks**:
            If the tests are successful and you're on production, it deploys the checks using:
            ```bash
            npx checkly deploy --force
            ```

The Browser checks are using [Checklyhq](https://checklyhq.com) (homecheckly.spec.ts) and [danube web shop](https://www.danube-web.shop) (others) websites as a monitoring targets.

## Project Structure

- **Playwright tests**: Stored in the __checks__ folder.
- **Checkly Configuration**: checkly.config.ts defines key properties for checks and alert channels.
- **Alert Channels**: Configured in alert-channels.ts to send email alerts for failed checks.
- **GitHub Actions Workflow**: Automates deployment of tests and checks to Checkly.


## Customizing the Workflow

You can extend this workflow to add more alert channels (e.g., Slack, SMS) by modifying the `alert-channels.ts` file. You can also run the checks against different environments by updating the `ENVIRONMENT_URL` in the workflow file.
