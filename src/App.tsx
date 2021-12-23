import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {v4 as uuid} from 'uuid'

interface Item {
  id: string,
  content: string
}

const itemsFromBackend: Item[] = [
  {
    id: uuid(),
    content: "Task 1"
  },
  {
    id: uuid(),
    content: "Task 2"
  }
]

const columnsFromBackend = 
  {
    [uuid()]: {
      name: 'To do',
      items: itemsFromBackend
    },
    [uuid()]: {
      name: 'In Progress',
      items: []
    },
    [uuid()]: {
      name: "In Review",
      items: []
    },
    [uuid()]: {
      name: "Done",
      items: []
    }
  }

function onDragEnd(result: DropResult, columns: any, setColumns: any) {
  if (!result.destination) {
    return;
  }
  const {source, destination} = result

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]
    const sourceItems = [...sourceColumn.items]
    const destItems = [...destColumn.items]
    const [removed] = sourceItems.splice(source.index, 1)
    destItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    })
  } else {
    const column = columns[source.droppableId]
    const copiedItems = [...column.items]
    const [removed] = copiedItems.splice(source.index, 1)
    copiedItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    })
  }
  
}


function App() {
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
  const [columns, setColumns] = useState(columnsFromBackend)
  return (
    <div style = {{ display: 'flex', justifyContent: 'center', height: '100%'}}>
      <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([id, column]) => {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => {
                    return (
                      <div 
                        {...provided.droppableProps}
                        ref = {provided.innerRef}
                        style = {{
                          background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                          padding: 4,
                          width: 250,
                          minHeight: 500
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref = {provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style = {{
                                      userSelect: 'none',
                                      padding: 16,
                                      margin: '0 0 8px 0',
                                      minHeight: '50px',
                                      backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                                      color: 'white',
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                )
                              }}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    )
                  }}
                  
                </Droppable>
                </div>
            </div>
          )
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
