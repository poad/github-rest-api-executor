import { JSX } from 'solid-js';

function GitHubLoginButton(props: {clientId: string; redirectUri: string}): JSX.Element {
  return (
    <button class="border bg-slate-200 p-1 rounded m-2">
      <a href={`https://github.com/login/oauth/authorize?client_id=${props.clientId}&redirect_uri=${props.redirectUri}/api`}>Login with GitHub</a>
    </button>
  );
}

export default GitHubLoginButton;
