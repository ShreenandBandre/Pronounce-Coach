const STYLES = {
  ok: "bg-green-50 text-green-700 border-green-200",
  mispronounced: "bg-red-50 text-red-700 border-red-200",
  unclear: "bg-amber-50 text-amber-700 border-amber-200",
};
 
export default function WordHighlight({ word }) {
  return (
    <span title={word.tip} className={`inline-block px-2 py-1 m-1 rounded-lg border text-sm ${STYLES[word.status] || STYLES.ok}`}>
      {word.word}
    </span>
  );
}
