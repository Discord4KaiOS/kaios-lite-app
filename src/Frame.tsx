export default function Frame() {
  return (
    <div>
      <button
        onClick={() => {
          eval("alert(1+1)");
        }}
      >
        Test eval
      </button>
      <button onClick={() => {}}>Test nativeFetch</button>
    </div>
  );
}
