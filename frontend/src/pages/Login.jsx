"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import axios from "axios"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit=async (e)=>{
     
     e.preventDefault()
     try {
      const response=await axios.post("http://localhost:8000/api/users/Login",
       {
         email,
         password
       })
       //store token in localstorage we will use this in api call
       localStorage.setItem("token",response.data.data.AccessToken)

       alert("User login successfull")
       navigate("/dashboard")

     } catch (error) {
      onsole.error(error)
      alert(error.response?.data?.message || "Network error")
     }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => navigate("/signup")} className="text-sm">
              Don&apos;t have an account? Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
