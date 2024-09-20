import { createResource, createSignal, Suspense, type Component } from 'solid-js';
import { Highlight, Language } from 'solid-highlight';
import './components.css';

const InputBar: Component<{ token: string }> = (props: { token: string }) => {
  const [path, setPath] = createSignal<string>();
  const [url, setUrl] = createSignal<string>();
  const [method, setMethod] = createSignal<string>('GET');
  const [language] = createSignal<Language>(Language.JSON);
  const [data] = createResource(
    url, async (url) => {
      const response = await fetch(
        url,
        {
          method: method(),
          headers: [
            ['Authorization', `Bearer ${props.token}`],
          ],
        },
      );
      return JSON.stringify(await response.json(), null, 2);
    });

  return (
    <>
      <form class="w-[80%] mx-auto mt-4" onSubmit={() => false}>
        <label class="mx-auto">
          API path: <input type="text" name="path" class="size-3/5 border mr-4" onChange={(e) => setPath(e.target.value)} />
        </label>
        <label class="ml-0 mr-auto"> method:
          <select onChange={(e) => setMethod(e.target.value)}>
            <option value="GET" selected>GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </label>
        <input type="button" class="bg-slate-200 px-1.5 rounded mx-2" onClick={() => setUrl(() => `https://api.github.com${path()}`)} value="送信" />
      </form>
      <Suspense>
        <div class="w-[80%] mx-auto h-screen">
          <Highlight language={language()} class="w-full mx-auto mt-2 leading-5 h-5/6">
            {data()}
          </Highlight>
        </div>
      </Suspense>
    </>
  );
};

export default InputBar;
