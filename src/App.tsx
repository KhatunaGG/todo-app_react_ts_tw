import './App.css'
import { useEffect, useReducer, useState } from 'react';
import { IInitialState, ScreenWidthType, ActionType } from './types';


const initialState: IInitialState[] = [];



const reducer = (state: IInitialState[], action: ActionType) => {
  switch (action.type) {
    case 'ADD_TASK': return [...state, {
      id: state.length + 1,
      name: action.payload as string,
      completed: false
    }];

    case 'DELETE_TASK': return state.filter((item) => item.id !== action.payload);
    case "EDIT_TASK": return state.map((item) => {
      if (item.id !== action.payload) return item
      return { ...item, completed: !item.completed }
    });
    case 'SHOW_ALL_TASKS': return state as IInitialState[];
    case 'SHOW_ALL_ACTIVE': return state.filter((item) => !item.completed);
    case 'SHOW_ALL_COMPLETED': return state.filter((item) => item.completed);
    case 'CLEAR_ALL_COMPLETED': return state.filter((item) => !item.completed);
    default: return state
  }
}



function App() {
  const [screenWidth, setScreenWidth] = useState<ScreenWidthType>(window.innerWidth)
  const [darkMode, setDarkMode] = useState(false)
  const [todos, dispatch] = useReducer(reducer, initialState);

  const changeMode = () => {
    document.documentElement.classList.toggle('dark')
    setDarkMode(!darkMode)
  }


  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  return (
    <section className='App flex justify-center h-screen dark:bg-[#25273D] dark:duration-300'>
      {screenWidth > 374
        ?
        <div >
          <img className='' src="/assets/bg-desktop-img.png" alt="" />
        </div>
        :
        <div>
          <img className='' src="/assets/bg-mobile-img.jpg" alt="" />
        </div>
      }

      <section className="container w-[87.2%]  flex flex-col item-center justify-center absolute  top-10 mx-6 md:w-[540px] md:top-[70px] ">
        <div className="header w-full flex items-center justify-between mb-10 cursor-pointer">
          <img src={screenWidth > 374 ? "/assets/todo-logo-desktop.svg" : "/assets/todo-logo-mobile.svg"} alt="" />
          {screenWidth > 374 ?
            (<img style={{
              transform: `rotate(${!darkMode ? '360deg' : '0deg'})`,
              transition: 'transform 0.5s ease'
            }}
              onClick={changeMode}
              src={darkMode ? "/assets/moon-desktop.svg" : "/assets/sun-desktop.svg"} alt="" />)
            :
            (<img style={{
              transform: `rotate(${!darkMode ? '360deg' : '0deg'})`,
              transition: 'transform 0.5s ease'
            }}
              onClick={changeMode}
              src={darkMode ? "/assets/moon-mobile.svg" : "/assets/sun-mobile.svg"} alt="" />)
          }
        </div>

        <input
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              dispatch({
                type: 'ADD_TASK',
                payload: e.currentTarget.value
              })
              e.currentTarget.value = ''
            }
          }}
          className="border rounded-md pl-5 py-3.5 border-none overflow-hidden shadow-lg outline-none mb-4 md:mb-6 md:text-lg md:py-5
          dark:border-b dark:bg-[#393A4B] dark:shadow-none dark:duration-300 dark:text-[#C8CBE7]" type="text" placeholder="Create a new todo…" />
        <article className="taskwrapper w-full  rounded-md bg-white shadow-lg mb-4 dark:bg-[#393A4B] dark:duration-300 ">
          {todos.map((item) => (
            <div key={item.id} className="item w-full flex flex-row items-center justify-between  border-b border-[#E3E4F1] py-4 px-5 md:py-[19px] dark:border-[#C8CBE7]">
              {item.completed
                ? <img
                  onClick={() => dispatch({
                    type: "EDIT_TASK",
                    payload: item.id
                  })}
                  style={{ width: screenWidth > 374 ? '24px' : '20px', height: screenWidth > 374 ? '24px' : '20px', background: 'transparent' }}
                  src={screenWidth > 374 ? '/assets/check-icon.png' : '/assets/check-icon.png'} alt="" />
                : (
                  <div
                    onClick={() => dispatch({
                      type: "EDIT_TASK",
                      payload: item.id
                    })}
                    className="w-[20px] h-[20px] rounded-full border border-[#E3E4F1] md:w-[24px] md:h-[24px] dark:border  dark:border-[#C8CBE7]"></div>
                )}
              <p style={{ textDecoration: item.completed ? 'line-through' : 'none' }}
                className="text text-left ml-3 w-full text-xs font-normal text-[#494C6B] md:text-lg md:tracking-[-0.25px]
              dark:text-[#C8CBE7]">{item.name}</p>
              <img
                onClick={() => dispatch({
                  type: 'DELETE_TASK',
                  payload: item.id
                })}
                src={screenWidth > 374 ? '/assets/del-desktop-icon.svg' : '/assets/del-mobile-icon.svg'} alt=""
                className='w-[18px] h-[18px]' />
            </div>
          ))}

          <div className="footer-desktop w-full flex flex-row items-center justify-between rounded-b-md 
                 border-b border-[#E3E4F1] px-5 pt-4 pb-[22px] shadow-md md:py-4 dark:shadow-none dark:bg-[#393A4B] dark:duration-300 ">
            <button className="text-xs font-normal text-[#9495A5] tracking-[-0.17px] md:text-sm md:tracking-[-0.19px] hover:text-[#3A7CFD] dark:hover:text-[#C8CBE7]">{todos.length} items left</button>
            {screenWidth > 375 && (
              <div className="item flex flex-row items-center justify-center gap-[19px] border-[#E3E4F1] ">
                <button
                  onClick={() => dispatch({
                    type: 'SHOW_ALL_TASKS',
                    payload: todos
                  })}
                  className="text-sm font-bold text-[#9495A5] tracking-[-0.19px] hover:text-[#3A7CFD] dark:hover:text-[#C8CBE7]">All</button>
                <button
                  onClick={() => dispatch({
                    type: 'SHOW_ALL_ACTIVE',
                    payload: todos
                  })}
                  className="text-sm font-bold text-[#9495A5] tracking-[-0.19px] hover:text-[#3A7CFD] dark:hover:text-[#C8CBE7]">Active</button>
                <button
                  onClick={() => dispatch({
                    type: 'SHOW_ALL_COMPLETED',
                    payload: todos
                  })}
                  className="text-sm font-bold text-[#9495A5] tracking-[-0.19px] hover:text-[#3A7CFD] dark:hover:text-[#C8CBE7]">Completede</button>
              </div>
            )}
            <button
              onClick={() => dispatch({
                type: 'CLEAR_ALL_COMPLETED',
                payload: todos
              })}
              className="text-xs font-normal text-[#9495A5] tracking-[-0.17px] md:text-sm md:tracking-[-0.19px] hover:text-[#3A7CFD] dark:hover:text-[#C8CBE7]">Clear Completed</button>
          </div>
        </article>

        {screenWidth < 375 && (
          <div className="footer-mobile w-full flex flex-row items-center justify-center gap-[19px] rounded-md shadow-lg
             border-b border-[#E3E4F1] px-4 py-4  bg-white dark:border-b dark:border-[#C8CBE7] dark:bg-[#393A4B] dark:duration-300 ">
            <button
              onClick={() => dispatch({
                type: 'SHOW_ALL_TASKS',
                payload: todos
              })}
              className="text-sm font-bold text-[#9495A5] hover:text-[#3A7CFD] tracking-[-0.19px] dark:hover:text-[#C8CBE7]">All</button>
            <button
              onClick={() => dispatch({
                type: 'SHOW_ALL_ACTIVE',
                payload: todos
              })}
              className="text-sm font-bold text-[#9495A5] hover:text-[#3A7CFD] tracking-[-0.19px] dark:hover:text-[#C8CBE7]">Active</button>
            <button
              onClick={() => dispatch({
                type: 'SHOW_ALL_COMPLETED',
                payload: todos
              })}
              className="text-sm font-bold text-[#9495A5] hover:text-[#3A7CFD] tracking-[-0.19px] dark:hover:text-[#C8CBE7]">Completede</button>
          </div>
        )}
      </section>
    </section>
  )
}

export default App
