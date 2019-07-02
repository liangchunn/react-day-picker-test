import React from 'react';
import DatePicker from './DatePicker/DatePicker';
import noop from './util/noop';

const App: React.FC = () => {
  return (
    <div>
      <DatePicker
        initialMonth={new Date()}
        changeListener={noop}
        initFrom={undefined}
        initTo={undefined}
      />
    </div>
  );
};

export default App;
