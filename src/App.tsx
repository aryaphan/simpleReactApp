import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {v4 as uuid} from 'uuid'
import { BoardColumn } from './types/boardColumn';
import { Ticket } from './types/ticket';
import { TicketStatus } from './types/ticketStatus';

const itemsFromBackend: Ticket[] = [
  {
    id: uuid(),
    title: "Task 1"
  },
  {
    id: uuid(),
    title: "Task 2"
  }
]

const columnsFromBackend: BoardColumn = {
  "To Do": {
    tickets: itemsFromBackend
  },
  "In Progress": {
    tickets: []
  },
  "In Review": {
    tickets: []
  },
  "Done": {
    tickets: []
  }
} 
  

function onDragEnd(
  result: DropResult, 
  columns: BoardColumn, 
  setColumns: React.Dispatch<React.SetStateAction<BoardColumn>>
) {
  if (!result.destination) {
    return;
  }
  const {source, destination} = result

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId as TicketStatus]
    const destColumn = columns[destination.droppableId as TicketStatus]
    const sourceItems = [...sourceColumn.tickets]
    const destItems = [...destColumn.tickets]
    const [removed] = sourceItems.splice(source.index, 1)
    destItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId as TicketStatus]: {
        ...sourceColumn,
        tickets: sourceItems
      },
      [destination.droppableId as TicketStatus]: {
        ...destColumn,
        tickets: destItems
      }
    })
  } else {
    const column = columns[source.droppableId as TicketStatus]
    const copiedItems = [...column.tickets]
    const [removed] = copiedItems.splice(source.index, 1)
    copiedItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        tickets: copiedItems
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
        {Object.entries(columns).map(([taskStatus, column]) => {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <h2>{taskStatus}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={taskStatus} key={taskStatus}>
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
                        {column.tickets.map((ticket, index) => {
                          return (
                            <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
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
                                    {ticket.title}
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
