import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import Hour from "@/components/ui/hour.jsx";
import PrioritySelector from "@/components/ui/priority.jsx";

const API_KEY = import.meta.env.VITE_CHATBOT_KEY;
const systemMessage = {
    "role": "system", "content": "Respond in the same language that I write."
}

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
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        {
            message: "Hello, I'm your assistant! How can I help you with your tasks?",
            sentTime: "just now",
            direction: 'ingoing',
            sender: "ChatGPT"
        }
    ]);

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/task/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setTask(data);
                })
                .catch(() => {
                    setLoading(false);
                })
        }, [])
    }


    const handleSend = async (message) => {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user"
        };

        const newMessages = [...messages, newMessage];

        setMessages(newMessages);
        setIsTyping(true);
        await processMessageToChatGPT(newMessages);
    };

    async function processMessageToChatGPT(chatMessages) {

        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "ChatGPT") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.message }
        });

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,
                ...apiMessages
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
            }).then((data) => {
                return data.json();
            }).then((data) => {
                console.log(data);
                setMessages([...chatMessages, {
                    message: data.choices[0].message.content,
                    direction: 'ingoing',
                    sender: "ChatGPT"
                }]);
                setIsTyping(false);
            });
    }

    const onSubmit = ev => {
        ev.preventDefault();

        if (task.id) {
            axiosClient.put(`/task/${task.id}`, task)
                .then(() => {
                    setNotification('User was successfully updated');
                    navigate('/task');
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
        <div className="max-w-7xl min-h-[435px] mx-auto text-dark-task bg-white rounded-[6px] p-4 mt-4 shadow-xl flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 pr-0 lg:pr-4">
                <div className="flex justify-between items-center">
                    {!loading ? (
                        <>
                            {task.id && <h1 className="mb-2 font-bold text-lg">Update Task: {task.name}</h1>}
                            {!task.id && <h1 className="mb-2 font-bold text-lg">Create new Task</h1>}
                        </>
                    ) : null}
                </div>
                <div>
                    {loading && (
                        <div className="text-center my-auto font-bold">Loading...</div>
                    )}
                    {errors && (
                        <div className="bg-red-500 rounded-[6px] mb-4 p-4 text-white font-bold">
                            {Object.keys(errors).map((key) => (
                                <p key={key}>{errors[key][0]}</p>
                            ))}
                        </div>
                    )}
                    {!loading && (
                        <form onSubmit={onSubmit}>
                            <label>Task name</label>
                            <Input
                                className="mb-4"
                                value={task.name}
                                onChange={(ev) => setTask({ ...task, name: ev.target.value })}
                                placeholder="Name"
                            />
                            <div className="flex mb-4">
                                <div className="mr-2 w-full lg:w-1/2">
                                    <label>Category</label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select the category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Studies</SelectItem>
                                            <SelectItem value="2">Work</SelectItem>
                                            <SelectItem value="3">Friends</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full lg:w-1/2">
                                    <label>Sub-category</label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select the sub-category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Studies</SelectItem>
                                            <SelectItem value="2">Work</SelectItem>
                                            <SelectItem value="3">Friends</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="mr-2 w-full lg:w-1/2">
                                    <label>Duration</label>
                                    <Hour className="" variant="popover" />
                                </div>
                                <div className="w-full lg:w-1/2">
                                    <label>Priority</label>
                                    <PrioritySelector variant="form" />
                                </div>
                            </div>
                            <label>Observation</label>
                            <Textarea
                                className="mb-4 resize-none"
                                value={task.observation}
                                onChange={(ev) => setTask({ ...task, observation: ev.target.value })}
                                placeholder="Write your observation..."
                            />
                            <div className="flex justify-end">
                                <Button className="w-full">Save new task</Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <div className="w-full lg:w-1/2 pl-0 lg:pl-4 mt-4 lg:mt-0 h-[435px] ">
                <MainContainer>
                    <ChatContainer>
                        <MessageList
                            scrollBehavior="smooth"
                            typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
                        >
                            {messages.map((message, i) => (
                                <Message key={i} model={message} />
                            ))}
                        </MessageList>
                        <MessageInput placeholder="Type message here" onSend={handleSend} />
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    )
}
