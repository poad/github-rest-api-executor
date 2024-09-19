import { Show, type Component } from 'solid-js';
import cookie from 'cookie';
import InputBar from './features/InputBar/components';
import GitHubLoginButton from './features/GitHubAuth/components';

const App: Component = () => {
  const tokens = cookie.parse(document.cookie);
  return (
    <>
      <nav>
        <Show when={!tokens?.['refresh-token']}>
          <GitHubLoginButton clientId={import.meta.env.VITE_GITHUB_APP_CLIENT_ID} redirectUri={window.location.origin} />
        </Show>
      </nav>
      <Show when={tokens?.['access-token']}>
        <InputBar token={tokens?.['access-token']} />
      </Show>
    </>
  );
};

export default App;
