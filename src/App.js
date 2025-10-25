import React, { useState } from 'react';

function App() {
  const [data, setData] = useState('X');

  async function handleFunction1Click() {

    try {
      const text = await (await fetch(`/api/Function1`)).text();
      setData(text + "___");
    }
    catch (ex) {
      setData(ex);
    }
  }

  async function handleFunction2Click() {

    try {
      const text = await (await fetch(`/api/Function2`)).text();
      setData(text + "___");
    }
    catch (ex) {
      setData(ex);
    }
  }


  return <>
    <table>
      <tbody>

        <tr>
          <td>Function 1</td>
          <td><button onClick={handleFunction1Click}>Function 1</button></td>
        </tr>
        <tr>
          <td>Function 2</td>
          <td><button onClick={handleFunction2Click}>Function 2</button></td>
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
