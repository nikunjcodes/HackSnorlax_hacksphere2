import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, FlaskRoundIcon as Flask, Clock, Users, ArrowRight, Filter } from "lucide-react"

export default function LabsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Virtual Labs</h1>
        <p className="text-muted-foreground">Access interactive experiments with real-time AI guidance</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search labs..." className="w-full pl-8" />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Labs</TabsTrigger>
          <TabsTrigger value="physics">Physics</TabsTrigger>
          <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
          <TabsTrigger value="biology">Biology</TabsTrigger>
          <TabsTrigger value="computer-science">Computer Science</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>Quantum Mechanics Lab</CardTitle>
                  <Badge>Physics</Badge>
                </div>
                <CardDescription>Explore quantum phenomena through interactive simulations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden bg-muted mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=360"
                    alt="Quantum mechanics lab interface"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Flask className="mr-1 h-4 w-4" />
                      <span>5 experiments</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>2-3 hours</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>243 users</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Enter Lab
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>Molecular Biology Lab</CardTitle>
                  <Badge>Biology</Badge>
                </div>
                <CardDescription>DNA extraction and analysis with virtual equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden bg-muted mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=360"
                    alt="Molecular biology lab interface"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Flask className="mr-1 h-4 w-4" />
                      <span>4 experiments</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>3-4 hours</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>187 users</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Enter Lab
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>Neural Networks Lab</CardTitle>
                  <Badge>Computer Science</Badge>
                </div>
                <CardDescription>Build and train neural networks with visual tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden bg-muted mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=360"
                    alt="Neural networks lab interface"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Flask className="mr-1 h-4 w-4" />
                      <span>6 experiments</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>4-5 hours</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>312 users</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Enter Lab
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>Chemical Reactions Lab</CardTitle>
                  <Badge>Chemistry</Badge>
                </div>
                <CardDescription>Simulate chemical reactions and analyze results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden bg-muted mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=360"
                    alt="Chemical reactions lab interface"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Flask className="mr-1 h-4 w-4" />
                      <span>8 experiments</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>2-3 hours</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>276 users</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Enter Lab
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>Circuit Design Lab</CardTitle>
                  <Badge>Physics</Badge>
                </div>
                <CardDescription>Design and test electronic circuits virtually</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden bg-muted mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=360"
                    alt="Circuit design lab interface"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Flask className="mr-1 h-4 w-4" />
                      <span>7 experiments</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>3-4 hours</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>198 users</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Enter Lab
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>Data Analysis Lab</CardTitle>
                  <Badge>Computer Science</Badge>
                </div>
                <CardDescription>Analyze datasets with AI-powered visualization tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden bg-muted mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=360"
                    alt="Data analysis lab interface"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Flask className="mr-1 h-4 w-4" />
                      <span>5 experiments</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>2-3 hours</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>254 users</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Enter Lab
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="physics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>Quantum Mechanics Lab</CardTitle>
                  <Badge>Physics</Badge>
                </div>
                <CardDescription>Explore quantum phenomena through interactive simulations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden bg-muted mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=360"
                    alt="Quantum mechanics lab interface"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Flask className="mr-1 h-4 w-4" />
                      <span>5 experiments</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>2-3 hours</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>243 users</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Enter Lab
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>Circuit Design Lab</CardTitle>
                  <Badge>Physics</Badge>
                </div>
                <CardDescription>Design and test electronic circuits virtually</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden bg-muted mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=360"
                    alt="Circuit design lab interface"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Flask className="mr-1 h-4 w-4" />
                      <span>7 experiments</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>3-4 hours</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>198 users</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Enter Lab
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="chemistry" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>Chemical Reactions Lab</CardTitle>
                  <Badge>Chemistry</Badge>
                </div>
                <CardDescription>Simulate chemical reactions and analyze results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden bg-muted mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=360"
                    alt="Chemical reactions lab interface"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Flask className="mr-1 h-4 w-4" />
                      <span>8 experiments</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>2-3 hours</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>276 users</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Enter Lab
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

