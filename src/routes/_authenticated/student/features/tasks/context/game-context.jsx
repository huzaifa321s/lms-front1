import React, { createContext, useContext, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'


const TasksContext = createContext(null)

export default function TasksProvider({ children }) {
  const [open, setOpen] = useDialogState(null)
  const [currentRow, setCurrentRow] = useState(null)
  console.log('currentRow ===>',currentRow);
  return (
    <TasksContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TasksContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGames = () => {
  const tasksContext = useContext(TasksContext);

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }
  return tasksContext
}