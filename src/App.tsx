import { Show, type Component } from 'solid-js';
import cookie from 'cookie';

const App: Component = () => {
  const tokens = cookie.parse(document.cookie);
  return (
    <>
      <nav>
        <Show when={!tokens?.['refresh-token']}>
          <button>
            <a href={`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_APP_CLIENT_ID}&redirect_uri=${window.location.origin}/api`}>Login with GitHub</a>
          </button>
        </Show>
      </nav>
      <Show when={tokens?.['refresh-token']}>
        <form>
          <label>API path: <input type="text" name="path" /></label>
          <select>
            <option value="GET" selected>GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </form>
      </Show>
    </>
  );
};

export default App;
