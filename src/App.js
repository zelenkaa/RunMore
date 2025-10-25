import React, { useState } from 'react';

function App() {
  const [data, setData] = useState('X');

  async function handleFunction1Click() {

    try {
      const text = await (await fetch(`/api/Function1`)).text();
      setData(text);
    }
    catch (ex) {
      setData(ex);
    }
  }

  async function handleFunction2Click() {

    try {
      const text = await (await fetch(`/api/Function2`)).text();
      setData(text);
    }
    catch (ex) {
      setData(ex);
    }
  }

  async function handleFunction3Click() {

    try {
      const text = await (await fetch(`/api/Function3`)).text();
      setData(text);
    }
    catch (ex) {
      setData(ex);
    }
  }


  return <>
    <table>
      <tbody>

        <tr>
          <td><button onClick={handleFunction1Click}>Function 1</button></td>
        </tr>
        <tr>
          <td><button onClick={handleFunction2Click}>Function 2</button></td>
        </tr>
        <tr>
          <td><button onClick={handleFunction3Click}>Function 3</button></td>
        </tr>
        <tr>
          <th colSpan="2">Results</th>
        </tr>
        <tr>
          <td colSpan="2">{data}</td>
        </tr>
      </tbody>
    </table>


  </>;
}

export default App;
