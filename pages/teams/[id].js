import { supabase } from '../../utils/initSupabase'
import NavBar from '../../components/NavBar'
import { useState } from 'react'
import CallList from '../../components/CallList'

export const getServerSideProps = async (context) => {
  const { params } = context

  try {
    let { data: employees, error } = await supabase
      .from('employees')
      .select('id, first_name, last_name')
      .eq('team_id', params.id)
      .eq('deleted', 'false')
      .order('last_name', { ascending: true })

    return {
      props: {
        employees: employees,
        team_id: params.id,
      },
    }
  } catch (e) {
    console.log(e)
  }
}

const Employees = ({ employees, team_id }) => {
  const [showCallList, setShowCallList] = useState(false)
  const [employeeId, setEmployeeId] = useState('')
  const [showEmployeeInput, setShowEmployeeInput] = useState(false)
  const [employeesList, setEmployeesList] = useState(employees)
  const [employeeInputFirstName, setEmployeeInputFirstName] = useState('')
  const [employeeInputLastName, setEmployeeInputLastName] = useState('')

  const deleteEmployee = async (id) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update({ deleted: 'true' })
        .eq('id', id.toString())

      if (!error) {
        const newList = employeesList.filter((employee) => employee.id !== id)
        setEmployeesList(newList)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const createEmployee = async () => {
    try {
      const { data, error } = await supabase.from('employees').insert([
        {
          team_id: team_id,
          first_name: employeeInputFirstName,
          last_name: employeeInputLastName,
        },
      ])

      if (!error) {
        setEmployeeInputFirstName('')
        setEmployeeInputLastName('')
        setShowEmployeeInput(false)
        const trimmedData = {
          id: data[0].id,
          first_name: data[0].first_name,
          last_name: data[0].last_name,
        }

        setEmployeesList((originalElements) => [trimmedData, ...originalElements])
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <main>
      <NavBar />
      <section>
        <h1>Employees</h1>
        <button onClick={() => setShowEmployeeInput(!showEmployeeInput)}>
          Add Employee
        </button>
        {showEmployeeInput && (
          <div>
            <input
              placeholder='First name'
              type='text'
              value={employeeInputFirstName}
              onChange={(e) => setEmployeeInputFirstName(e.target.value)}
            />
            <input
              placeholder='Last name'
              type='text'
              value={employeeInputLastName}
              onChange={(e) => setEmployeeInputLastName(e.target.value)}
            />
            <button onClick={createEmployee}>Create</button>
          </div>
        )}
        <ul>
          {employeesList.map((emp) => {
            return (
              <li key={emp.id}>
                <p>
                  {emp.id} {emp.first_name} {emp.last_name}
                </p>
                <button
                  onClick={() => {
                    setEmployeeId(emp.id)
                    setShowCallList(true)
                  }}
                >
                  Show Call Entries
                </button>
                <button onClick={() => deleteEmployee(emp.id)}>Delete</button>
              </li>
            )
          })}
          {showCallList && <CallList employeeId={employeeId} />}
        </ul>
      </section>
    </main>
  )
}

export default Employees
