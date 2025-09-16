"use client"

import { useState, useEffect, useContext } from "react"
import { ChatbotUIContext } from "@/context/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  IconSearch,
  IconFileText,
  IconBrain,
  IconChartLine,
  IconPlayerPlay,
  IconPlayerStop,
  IconDownload,
  IconShare
} from "@tabler/icons-react"
import { toast } from "sonner"

interface ResearchSession {
  id: string
  topic: string
  research_questions: string[]
  status:
    | "idle"
    | "searching"
    | "processing"
    | "synthesizing"
    | "completed"
    | "error"
  progress: number
  papers_found: number
  papers_analyzed: number
  synthesis: any
  created_at: string
  updated_at: string
}

interface ResearchInterfaceProps {}

export const ResearchInterface: React.FC<ResearchInterfaceProps> = () => {
  const { chatSettings, userInput, setUserInput } = useContext(ChatbotUIContext)

  const [researchTopic, setResearchTopic] = useState("")
  const [researchQuestions, setResearchQuestions] = useState<string[]>([""])
  const [activeSession, setActiveSession] = useState<ResearchSession | null>(
    null
  )
  const [sessions, setSessions] = useState<ResearchSession[]>([])
  const [isStarting, setIsStarting] = useState(false)
  const [streamingData, setStreamingData] = useState<any[]>([])

  const backendUrl =
    process.env.NEXT_PUBLIC_NOCTURNAL_API_URL || "http://localhost:8000"

  const addResearchQuestion = () => {
    setResearchQuestions([...researchQuestions, ""])
  }

  const removeResearchQuestion = (index: number) => {
    if (researchQuestions.length > 1) {
      setResearchQuestions(researchQuestions.filter((_, i) => i !== index))
    }
  }

  const updateResearchQuestion = (index: number, value: string) => {
    const updated = [...researchQuestions]
    updated[index] = value
    setResearchQuestions(updated)
  }

  const startResearch = async () => {
    if (!researchTopic.trim()) {
      toast.error("Please enter a research topic")
      return
    }

    const validQuestions = researchQuestions.filter(q => q.trim())
    if (validQuestions.length === 0) {
      toast.error("Please enter at least one research question")
      return
    }

    setIsStarting(true)

    try {
      // Create research session
      const sessionResponse = await fetch(
        `${backendUrl}/api/research/start_job`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            topic: researchTopic,
            research_questions: validQuestions,
            user_id: "demo_user", // TODO: Get from auth
            session_id: `session_${Date.now()}`
          })
        }
      )

      if (!sessionResponse.ok) {
        throw new Error("Failed to start research session")
      }

      const { job_id } = await sessionResponse.json()

      // Create local session object
      const newSession: ResearchSession = {
        id: job_id,
        topic: researchTopic,
        research_questions: validQuestions,
        status: "searching",
        progress: 0,
        papers_found: 0,
        papers_analyzed: 0,
        synthesis: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setActiveSession(newSession)
      setSessions(prev => [newSession, ...prev])

      // Start streaming updates
      startStreamingUpdates(job_id)

      toast.success("Research session started!")
    } catch (error) {
      console.error("Error starting research:", error)
      toast.error("Failed to start research session")
    } finally {
      setIsStarting(false)
    }
  }

  const startStreamingUpdates = (sessionId: string) => {
    const eventSource = new EventSource(
      `${backendUrl}/api/research/stream/${sessionId}`
    )

    eventSource.onmessage = event => {
      try {
        const data = JSON.parse(event.data)
        setStreamingData(prev => [...prev, data])

        // Update session progress
        if (data.type === "progress") {
          setActiveSession(prev =>
            prev
              ? {
                  ...prev,
                  status: data.status,
                  progress: data.progress,
                  papers_found: data.papers_found || prev.papers_found,
                  papers_analyzed: data.papers_analyzed || prev.papers_analyzed,
                  updated_at: new Date().toISOString()
                }
              : null
          )
        }

        // Handle completion
        if (data.type === "completed") {
          setActiveSession(prev =>
            prev
              ? {
                  ...prev,
                  status: "completed",
                  progress: 100,
                  synthesis: data.synthesis,
                  updated_at: new Date().toISOString()
                }
              : null
          )
          eventSource.close()
        }
      } catch (error) {
        console.error("Error parsing streaming data:", error)
      }
    }

    eventSource.onerror = error => {
      console.error("Streaming error:", error)
      eventSource.close()
    }
  }

  const stopResearch = async () => {
    if (!activeSession) return

    try {
      await fetch(`${backendUrl}/api/research/stop/${activeSession.id}`, {
        method: "POST"
      })

      setActiveSession(prev =>
        prev
          ? {
              ...prev,
              status: "idle"
            }
          : null
      )

      toast.success("Research stopped")
    } catch (error) {
      console.error("Error stopping research:", error)
      toast.error("Failed to stop research")
    }
  }

  const downloadSynthesis = async () => {
    if (!activeSession?.synthesis) return

    const blob = new Blob([JSON.stringify(activeSession.synthesis, null, 2)], {
      type: "application/json"
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `research-synthesis-${activeSession.topic}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      case "processing":
        return "bg-blue-500"
      case "searching":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Research Automation</h1>
          <p className="text-muted-foreground">
            AI-powered research synthesis and analysis
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => window.open("/api/docs", "_blank")}
          >
            API Docs
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("/metrics", "_blank")}
          >
            Metrics
          </Button>
        </div>
      </div>

      <Tabs defaultValue="new-research" className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new-research">New Research</TabsTrigger>
          <TabsTrigger value="active-session">Active Session</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="new-research" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <IconSearch className="h-5 w-5" />
                <span>Research Topic</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter your research topic (e.g., 'Quantum Computing in Machine Learning')"
                value={researchTopic}
                onChange={e => setResearchTopic(e.target.value)}
                className="text-lg"
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Research Questions</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addResearchQuestion}
                  >
                    Add Question
                  </Button>
                </div>

                {researchQuestions.map((question, index) => (
                  <div key={index} className="flex space-x-2">
                    <Textarea
                      placeholder={`Research question ${index + 1}`}
                      value={question}
                      onChange={e =>
                        updateResearchQuestion(index, e.target.value)
                      }
                      className="flex-1"
                      rows={2}
                    />
                    {researchQuestions.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeResearchQuestion(index)}
                        className="shrink-0"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                onClick={startResearch}
                disabled={isStarting || !researchTopic.trim()}
                className="w-full"
                size="lg"
              >
                {isStarting ? (
                  <>
                    <IconPlayerPlay className="mr-2 h-4 w-4 animate-spin" />
                    Starting Research...
                  </>
                ) : (
                  <>
                    <IconPlayerPlay className="mr-2 h-4 w-4" />
                    Start Research
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-session" className="space-y-6">
          {activeSession ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Active Research: {activeSession.topic}</span>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(activeSession.status)}>
                      {activeSession.status}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={stopResearch}>
                      <IconPlayerStop className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{activeSession.progress}%</span>
                  </div>
                  <Progress value={activeSession.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {activeSession.papers_found}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Papers Found
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {activeSession.papers_analyzed}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Papers Analyzed
                    </div>
                  </div>
                </div>

                {activeSession.status === "completed" &&
                  activeSession.synthesis && (
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <Button onClick={downloadSynthesis}>
                          <IconDownload className="mr-2 h-4 w-4" />
                          Download Synthesis
                        </Button>
                        <Button variant="outline">
                          <IconShare className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <IconBrain className="h-5 w-5" />
                            <span>Research Synthesis</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose max-w-none">
                            <h3>Key Findings</h3>
                            <ul>
                              {activeSession.synthesis.key_findings?.map(
                                (finding: string, i: number) => (
                                  <li key={i}>{finding}</li>
                                )
                              )}
                            </ul>

                            <h3>Research Gaps</h3>
                            <ul>
                              {activeSession.synthesis.research_gaps?.map(
                                (gap: string, i: number) => (
                                  <li key={i}>{gap}</li>
                                )
                              )}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                {/* Streaming Updates */}
                {streamingData.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Live Updates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {streamingData.slice(-10).map((update, index) => (
                          <div
                            key={index}
                            className="text-sm p-2 bg-muted rounded"
                          >
                            <span className="font-medium">{update.type}:</span>{" "}
                            {update.message}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <IconSearch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Active Research
                </h3>
                <p className="text-muted-foreground">
                  Start a new research session to begin automated analysis
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {sessions.length > 0 ? (
            sessions.map(session => (
              <Card key={session.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{session.topic}</span>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(session.created_at).toLocaleString()}
                    </div>
                    <div className="text-sm">
                      Papers: {session.papers_found} found,{" "}
                      {session.papers_analyzed} analyzed
                    </div>
                    {session.synthesis && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveSession(session)}
                      >
                        View Results
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <IconFileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Research History
                </h3>
                <p className="text-muted-foreground">
                  Your completed research sessions will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
