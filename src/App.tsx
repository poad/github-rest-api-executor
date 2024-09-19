import { Show, type Component } from 'solid-js';
// import cookie from 'cookie';

const App: Component = () => {
  // const tokens = cookie.parse(document.cookie);
  return (
    <>
      <nav>
        <button>
          <a href={`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_APP_CLIENT_ID}&redirect_uri=${window.location.origin}/api`}>Login with GitHub</a>
        </button>
      </nav>
      <p class="text-4xl text-green-700 text-center py-20">Hello tailwind!</p>
      <Show when={document.cookie}>
        <p>
          {JSON.stringify(document.cookie)}
        </p>
      </Show>
    </>
  );
};

export default App;
