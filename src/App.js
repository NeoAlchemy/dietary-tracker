import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    (async function () {
      const { text } = await( await fetch(`/api/message?name=Ryan`)).json();
      setData(text);
    })();
  });

  return <div>{data}</div>;
}

export default App;
