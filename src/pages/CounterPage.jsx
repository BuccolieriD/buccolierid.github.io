import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../slices/counterSlice';
import NavBar from '../components/NavBar';
import PageHero from '../components/PageHero';

// Background dedicato (tema: numeri/grafici)
const counterBg = 'https://images.unsplash.com/photo-1551281044-8f785ba67e45?q=80&w=1920&auto=format&fit=crop';

const CounterPage = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <div>
      <NavBar current="Counter" />
      <PageHero title="Counter" bgImage={counterBg} />
      <div className="prose max-w-3xl mx-auto p-6">
        <h1>Counter</h1>
        <p>Value: <strong>{count}</strong></p>
        <div className="space-x-2">
          <button onClick={() => dispatch(increment())} className="px-3 py-1 border rounded">+1</button>
          <button onClick={() => dispatch(decrement())} className="px-3 py-1 border rounded">-1</button>
          <button onClick={() => dispatch(incrementByAmount(5))} className="px-3 py-1 border rounded">+5</button>
        </div>
      </div>
    </div>
  );
};

export default CounterPage;
