import { createSignal, Show, type Component } from 'solid-js';
import { Highlight, Language } from 'solid-highlight';

const InputBar: Component<{ token: string }> = (props: { token: string }) => {
  const [path, setPath] = createSignal<string>();
  const [method, setMethod] = createSignal<string>('GET');
  const [data, setData] = createSignal<string>();
  const [language] = createSignal<Language>(Language.JSON);
  function executeApi() {
    fetch(
      `https://api.github.com${path()}`,
      {
        method: method(),
        headers: [
          ['Authorization', `Bearer ${props.token}`],
        ],
      }).then((response) => response.json().then(res => setData(() => JSON.stringify(res, null, 2))));
  }

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
        <input type="button" class="bg-slate-200 px-1.5 rounded mx-2" onClick={() => executeApi()} value="送信" />
      </form>
      <div class="w-[80%] mx-auto h-screen">
        {/* <textarea class="w-full mx-auto mt-2 border resize-y leading-5 h-5/6" area-disabled readOnly> */}
        <Show when={data()}>
          <Highlight language={language()}>
            {' '}
            {data()}{' '}
          </Highlight>
        </Show>
        {/* </textarea> */}
      </div>
    </>
  );
};

export default InputBar;
