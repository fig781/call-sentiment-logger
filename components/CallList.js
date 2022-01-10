import { supabase } from '../utils/initSupabase'
import { useState, useEffect } from 'react'
import FileUploader from './FileUploader'

const CallList = ({ employeeId }) => {
  const [callEntries, setCallEntries] = useState([])
  const [showEntryInput, setShowEntryInput] = useState(false)

  const [dateInput, setDateInput] = useState('')
  const [customerInput, setCustomerInput] = useState('')
  const [callLenInput, setCallLenInput] = useState('')
  const [fileInput, setFileInput] = useState(null)

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const { data: call_entries, error } = await supabase
          .from('call_entries')
          .select(
            'id, employee_id, deleted, call_date, in_app_id, sentiment_score, call_length, sound_file, customer'
          )
          .eq('employee_id', employeeId.toString())
          .eq('deleted', 'false')
          .order('inserted_at', { ascending: false })

        if (!error) {
          setCallEntries(call_entries)
        }
      } catch (e) {
        console.log(e)
      }
    }
    fetchCalls()
  }, [employeeId])

  const uploadFile = async () => {
    const file = fileInput

    console.log(fileInput)
    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      console.log(fileExt)
      console.log(fileName)
      console.log(filePath)

      const { data, error } = await supabase.storage
        .from('sound-files')
        .upload(filePath, file)

      console.log(data)
      console.log(error)
    }
  }

  const createEntry = async () => {
    const highestId = 0
    callEntries.forEach((i) => {
      if (highestId < i.in_app_id) {
        highestId = i.in_app_id
      }
    })
    highestId++

    try {
      const { data, error } = await supabase.from('call_entries').insert([
        {
          in_app_id: highestId,
          employee_id: employeeId,
          call_length: callLenInput,
          customer: customerInput,
          call_date: dateInput,
        },
      ])

      await uploadFile()

      if (!error) {
        setDateInput('')
        setCustomerInput('')
        setCallLenInput('')
        setFileInput('')
        setShowEntryInput(false)

        const trimmedData = {
          id: data[0].id,
          in_app_id: data[0].in_app_id,
          deleted: data[0].deleted,
          employee_id: data[0].employee_id,
          call_date: data[0].call_date,
          call_length: data[0].call_length,
          sentiment_score: null,
          sound_file: null,
          customer: data[0].customer,
        }

        setCallEntries((originalElements) => [trimmedData, ...originalElements])
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <section>
      <button onClick={() => setShowEntryInput(!showEntryInput)}>
        {showEntryInput ? 'Cancel' : 'Add Call entry'}
      </button>
      {showEntryInput && <button onClick={createEntry}>Add</button>}

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Call Length</th>
            <th>Sentiment Score</th>
            <th>Sound File</th>
          </tr>
        </thead>
        <tbody>
          {showEntryInput && (
            <tr>
              <td></td>
              <td>
                <input
                  type='text'
                  placeholder='Date'
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                />
              </td>
              <td>
                <input
                  type='text'
                  placeholder='Customer'
                  value={customerInput}
                  onChange={(e) => setCustomerInput(e.target.value)}
                />
              </td>
              <td>
                <input
                  type='text'
                  placeholder='Call Length'
                  value={callLenInput}
                  onChange={(e) => setCallLenInput(e.target.value)}
                />
              </td>
              <td></td>
              <td>
                <FileUploader handleFile={(file) => setFileInput(file)} />
              </td>
            </tr>
          )}
          {callEntries.map((entry) => {
            return (
              <tr key={entry.id}>
                <td>{entry.in_app_id}</td>
                <td>{entry.call_date}</td>
                <td>{entry.customer}</td>
                <td>{entry.call_length}</td>
                <td>{entry.sentiment_score}</td>
                <td>{entry.sound_file}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

export default CallList
