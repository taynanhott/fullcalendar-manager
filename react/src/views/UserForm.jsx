import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";

export default function UserForm() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false)
          setUser(data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault();

    if (user.id) {
      axiosClient.put(`/users/${user.id}`, user)
        .then(() => {
          setNotification('User was successfully updated');
          navigate('/users');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post(`/users`, user)
        .then(() => {
          setNotification('User was successfully created');
          navigate('/users');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }

  return (
    <div className="max-w-2xl min-h-[332px] mx-auto bg-white rounded-[6px] p-4 mt-4 shadow-xl">
      <div className="flex justify-between items-center">
        {!loading ?
          <>
            {user.id && <h1 className="mb-2 font-bold text-lg">Update User: {user.name}</h1>}
            {!user.id && <h1 className="mb-2 font-bold text-lg">New User</h1>}
          </> : <></>
        }

      </div>
      <div>
        {loading && (
          <div className="text-center my-auto font-bold">
            Loading...
          </div>
        )}
        {errors &&
          <div className="bg-red-500 rounded-[6px] mb-4 p-4 text-white font-bold">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        {!loading && (
          <form onSubmit={onSubmit}>
            <Input className="mb-4" value={user.name} onChange={ev => setUser({ ...user, name: ev.target.value })} placeholder="Name" />
            <Input className="mb-4" value={user.email} onChange={ev => setUser({ ...user, email: ev.target.value })} placeholder="Email" />
            <Input className="mb-4" type="password" onChange={ev => setUser({ ...user, password: ev.target.value })} placeholder="Password" />
            <Input className="mb-4" type="password" onChange={ev => setUser({ ...user, password_confirmation: ev.target.value })} placeholder="Password Confirmation" />
            <div className="flex justify-end">
              <Button type="button" className="bg-rose-500 hover:bg-rose-400 mr-2"><Link to="/users">Cancel</Link></Button>
              <Button>Save</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
