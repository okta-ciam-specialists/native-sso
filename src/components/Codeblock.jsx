import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

export const Codeblock = ({ data }) => {
  data = typeof data === 'string' ? data : JSON.stringify(data);

  return <JSONPretty {...{ id: 'json', data, mainStyle: 'padding:1em' }} />;
};
