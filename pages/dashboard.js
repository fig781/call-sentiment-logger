import { useState, useEffect } from 'react'
import Link from 'next/link'
import NavBar from '../components/NavBar'
import { supabase } from '../utils/initSupabase'

const Dashboard = () => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTeamInput, setShowTeamInput] = useState(false)
  const [teamInput, setTeamInput] = useState('')

  //should be set to serverside render
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true)
        const { data: teams, error } = await supabase
          .from('teams')
          .select('id, name, deleted')
          .eq('deleted', 'false')
          .order('inserted_at', { ascending: false })

        if (!error) {
          setTeams(teams)
        }

        setLoading(false)
      } catch (e) {
        console.log(e)
      }
    }
    fetchTeams()
  }, [])

  const deleteTeam = async (id) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update({ deleted: 'true' })
        .eq('id', id.toString())

      if (!error) {
        const newList = teams.filter((team) => team.id !== id)
        setTeams(newList)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const createTeam = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{ name: teamInput }])

      if (!error) {
        setTeamInput('')
        setShowTeamInput(false)
        const trimmedData = {
          id: data[0].id,
          name: data[0].name,
          deleted: data[0].deleted,
        }

        setTeams((originalElements) => [trimmedData, ...originalElements])
      }
    } catch (e) {
      console.log(e)
    }
  }

  const teamRender = teams.map((team) => {
    return (
      <Link key={team.id} href={'/teams/' + team.id}>
        <a>
          {team.name}
          <button onClick={() => deleteTeam(team.id)}>Delete</button>
        </a>
      </Link>
    )
  })

  return (
    <div>
      <NavBar />
      <div>
        <button onClick={() => setShowTeamInput(true)}>Add New Team</button>
        {showTeamInput && (
          <div>
            <input
              type='text'
              value={teamInput}
              onChange={(e) => setTeamInput(e.target.value)}
            />
            <button onClick={createTeam}>Create</button>
          </div>
        )}
        {!loading && teamRender}
      </div>
    </div>
  )
}

export default Dashboard
