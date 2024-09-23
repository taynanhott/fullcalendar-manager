import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";

export default function TaskForm() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [task, setTask] = useState({
        id: null,
        name: '',
        category: '',
        subcategory: '',
        observation: '',
        priority: '',
        date: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { setNotification } = useStateContext();

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/users/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setTask(data);
                })
                .catch(() => {
                    setLoading(false);
                })
        }, [])
    }

    const onSubmit = ev => {
        ev.preventDefault();

        if (task.id) {
            axiosClient.put(`/task/${task.id}`, task)
                .then(() => {
                    setNotification('User was successfully updated');
                    navigate('/users');
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                })
        } else {
            axiosClient.post(`/task`, task)
                .then(() => {
                    setNotification('User was successfully created');
                    navigate('/task');
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
                        {task.id && <h1 className="mb-2 font-bold text-lg">Update Task: {task.name}</h1>}
                        {!task.id && <h1 className="mb-2 font-bold text-lg">New Task</h1>}
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
                        <Input className="mb-4" value={task.name} onChange={ev => setTask({ ...task, name: ev.target.value })} placeholder="Name" />
                        <Select>
                            <SelectTrigger className="mb-4">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="mb-4">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input className="mb-4" value={task.priority} onChange={ev => setTask({ ...task, observation: ev.target.value })} placeholder="Priority" />
                        <Input className="mb-4" value={task.observation} onChange={ev => setTask({ ...task, observation: ev.target.value })} placeholder="Priority" />
                        <div className="flex justify-end">
                            <Button type="button" variant="destructive" className="mr-2"><Link to="/users">Cancel</Link></Button>
                            <Button>Save</Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
