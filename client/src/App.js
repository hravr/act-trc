import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const url = 'http://localhost:4000/api/activitys';
  const [activitys, setActivitys] = useState(null);
  const [items, setItems] = useState({});
  const form = useRef();

  // fetchData
  function fetchData() {
    fetch(url)
      .then(res => res.json()
        .then(activitys => setActivitys(activitys.reverse()))
      )
  }

  useEffect(() => {
    fetchData()
  }, [])

  // createActivity
  function createActivity(items) {
    form.current.reset();
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(items),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => (res.status === 200)
      ? fetchData()
      : console.log('err'))
      .then(activitys => activitys);
  }

  //Sum Time
  function sumTime({ ftime, stime }) {
    const sumTime = (new Date('2020-03-10T' + ftime)
      - new Date('2020-03-10T' + stime)) / 60000;
    if (sumTime >= 60) {
      return Math.trunc(sumTime / 60) + ' hour ' + (sumTime % 60 === 0 ? '' : sumTime % 60 + ' minutes')
    }
    else {
      return sumTime % 60 + ' minutes'
    }
  }

  //Speed
  function averageSpeed({ distance, ftime, stime }) {
    const average = distance / (
      (new Date('2020-03-10T' + ftime)
        - new Date('2020-03-10T' + stime)) / 60000)
      * 60
    return average.toFixed(1) + 'km/hour';
  }

  //Total
  function actTotal(type) {
    let sum = 0;
    activitys.map(activity => activity.act_type === type
      ? sum += activity.distance
      : null)
    return sum;
  }

  // Delete
  function deleteActivity(id) {
    fetch(url + '/' + id, {
      method: "DELETE"
    }).then(setActivitys(activitys.filter(act => act._id !== id)))
  }

  // longest
  function longest(type) {

    const typedActivities = activitys.filter(activity => activity.act_type === type
      ? activity.distance
      : null)

    const typedActivitiesDistance = typedActivities.map(act => act.distance)

    const [maxTypedActivitiesDistance] = activitys.filter(act => act.distance === Math.max(...typedActivitiesDistance))

    if (maxTypedActivitiesDistance === undefined) {
      return '0'
    }
    else {
      const sumTime = (new Date('2020-03-10T' + maxTypedActivitiesDistance.ftime)
        - new Date('2020-03-10T' + maxTypedActivitiesDistance.stime)) / 60000;
      function formatedTime() {
        if (sumTime >= 60) {
          return Math.trunc(sumTime / 60) + 'h ' + (sumTime % 60 === 0 ? '' : sumTime % 60 + 'm')
        } else {
          return sumTime % 60 + ' m'
        }
      }
      return [maxTypedActivitiesDistance.date, ' ', formatedTime(), ' ', maxTypedActivitiesDistance.distance, 'km'];
    }
  }

  return (
    activitys &&
    <div className='app'>
      <p className='title'>Activity Tracker</p>
      <form className='form' ref={form} >
        <input placeholder='Start Time' className={'items'} type='time'
          onChange={(e) => setItems({ ...items, stime: e.target.value })} />
        <input placeholder='Finish Time' className={'items'} type='time'
          onChange={(e) => setItems({ ...items, ftime: e.target.value })} />
        <input
          placeholder='Distance (km)'
          className={'items'}
          type='number'
          min='0'
          onChange={(e) => setItems({ ...items, distance: e.target.value })}
        />
        <select className='items' onClick={(e) => setItems({ ...items, act_type: e.target.value })}>
          <option hidden>Choose type</option>
          <option>Runing</option>
          <option>Riding</option>
        </select>
        <input className={'items'} type='button' value={'Save'} onClick={() => createActivity(items)} />
      </form>
      <div className='flex'>
        <div className='mainBlock'>
          {activitys.map(activity =>
            <div key={activity._id} className={'itemBlock'}>
              <div className={'items'}>
                {activity.date}
              </div>
              <div className={'items'}>
                {sumTime(activity)}
              </div>
              <div className={'items'}>
                {activity.act_type}
              </div>
              <div className={'items'}>
                {activity.distance + 'km'}
              </div>
              <div>
                {averageSpeed(activity)}
              </div>
              <input type='button' className='delite' onClick={() => deleteActivity(activity._id)} value='X' />
            </div>
          )}
        </div>
        <div>
          <div className='actTotal'>
            <p>Total run distance: {actTotal('Runing') + 'km'}</p>
            <p>Total ride distance: {actTotal('Riding') + 'km'}</p>
          </div>
          <div className='longest'>
            <p>Longest run: </p>
            <p>{longest('Runing')}</p>
            <p>Longest ride: </p>
            <p>{longest('Riding')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;