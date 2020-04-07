import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const url = 'http://localhost:4000/api/activitys';
  const [activitys, setActivitys] = useState(null); //сховище
  const [params, setParams] = useState({});
  const form = useRef();

  const fetchData = () => {
    fetch(url) //мастХЕВ
      .then(res => res.json()
        .then(activitys => setActivitys(activitys)))
  }

  useEffect(() => { // запускає ф-цію один раз при пустому масиві
    fetchData()
  }, [])

  const createActivity = (params) => {
    form.current.reset();
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => (res.status === 200)
      ? fetchData()
      : console.log('err'))
      .then(activitys => activitys);
  }

  //сума часу
  const time = ({ ftime, stime }) => {
    const time = (new Date('2020-03-10T' + ftime)
      - new Date('2020-03-10T' + stime)) / 60000;
    return time >= 60
      ? Math.trunc(time / 60) + ' hour ' + (time % 60 === 0 ? '' : time % 60 + ' minutes')
      : time % 60 + ' minutes'
  }
  //швидкысть
  const averageSpeed = ({ distance, ftime, stime }) => {
    const average = distance / (
      (new Date('2020-03-10T' + ftime)
        - new Date('2020-03-10T' + stime)) / 60000)
      * 60
    return average.toFixed(1) + 'km/hour';
  }

  //тотал
  const total = (type) => {
    let sum = 0;
    activitys.map(activity => activity.act_type === type
      ? sum += activity.distance
      : null)
    return sum
      ;
  }



  //   // Удаление 
  function deleteActivity(id) {
    fetch(url + '/' + id, {
      method: "DELETE"
    }).then(setActivitys(activitys.map(act => act._id !== id))) // фільтрація джс
  }

  const longest = (type) => {

    const typedActivities = activitys.filter(activity => activity.act_type === type
      ? activity.distance
      : null)

    const typedActivitiesDistance = typedActivities.map(act => act.distance)

    const [maxTypedActivitiesDistance] = activitys.filter(act => act.distance === Math.max(...typedActivitiesDistance))

    if (maxTypedActivitiesDistance === undefined) {
      return '0'
    }
    else {
      const time = (new Date('2020-03-10T' + maxTypedActivitiesDistance.ftime)
        - new Date('2020-03-10T' + maxTypedActivitiesDistance.stime)) / 60000;
      const formatedTime = time >= 60
        ? Math.trunc(time / 60) + 'h ' + (time % 60 === 0 ? '' : time % 60 + 'm')
        : time % 60 + ' m'

      return [maxTypedActivitiesDistance.date, ' ', formatedTime, ' ', maxTypedActivitiesDistance.distance, 'km'];
    }
  }



  return (
    activitys &&
    <div>
      <p className='title'>Activity Tracker</p>
      <form className='form' ref={form} >
        <input placeholder='Start Time' className={'params'} type='time'
          onChange={(e) => setParams({ ...params, stime: e.target.value })} />
        <input placeholder='Finish Time' className={'params'} type='time'
          onChange={(e) => setParams({ ...params, ftime: e.target.value })} />
        <input
          placeholder='Distance (km)'
          className={'params'}
          type='number'
          min='0'
          onChange={(e) => setParams({ ...params, distance: e.target.value })}
        />
        <select className='params' onClick={(e) => setParams({ ...params, act_type: e.target.value })}>
          <option hidden>Choose type</option>
          <option>Runing</option>
          <option>Riding</option>
        </select>
        <input className={'params'} type='button' value={'Save'} onClick={() => createActivity(params)} />
      </form>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div className='mainBlock'>
          {activitys.map(activity =>
            <div key={activity._id} className={'paramBlock'}>
              <div className={'params'}>
                {activity.date}
              </div>
              <div className={'params'}>
                {time(activity)}
              </div>
              <div className={'params'}>
                {activity.act_type}
              </div>
              <div className={'params'}>
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
          <div className='total'>
            <p>Total run distance: {total('Runing') + 'km'}</p>
            <p>Total ride distance: {total('Riding') + 'km'}</p>
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