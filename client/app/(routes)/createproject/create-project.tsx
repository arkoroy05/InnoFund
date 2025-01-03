"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import { CalendarIcon, PlusCircle, X, Paperclip, UserRoundPlus, Link } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileUpload } from "@/components/ui/file-upload";
import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  about: z.string().min(10, {
    message: "About section must be at least 10 characters.",
  }),
  teamMembers: z.array(z.string()).min(1, {
    message: "Please add at least one team member.",
  }),
  timeline: z.date({
    required_error: "Please select a completion date.",
  }),
  links: z
    .array(z.string().url({ message: "Please enter a valid URL." }))
    .optional(),
  citations: z.string().optional(),
  goalAmount: z.number().positive({
    message: "Goal amount must be a positive number.",
  }),
  pdfs: z
    .array(
      z.object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
      })
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateProjectForm() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
};

  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState([""]);
  const [links, setLinks] = useState([""]);
  const [pdfs, setPdfs] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [citations, setCitations] = useState(['']);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        console.log("User ID:", user.uid);
      } else {
        setUserId(null);
      }
    });
  
    // Cleanup subscription
    return () => unsubscribe();
  });

  const addCitation = () => setCitations([...citations, ''])
  const removeCitation = (index: number) => {
    const newCitations = citations.filter((_, i) => i !== index)
    setCitations(newCitations)
  }


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      about: "",
      teamMembers: [""],
      timeline: new Date(),
      links: [""],
      citations: [""],
      goalAmount: 0,
      pdfs: [],
    },
  });
  async function onSubmit(values: FormValues) {
    console.log("Form submission started");
    console.log("Current userId:", userId);
    
    if (!userId) {
        setError("User must be logged in to create a project");
        console.log("No userId found");
        return;
    }

    try {
        setIsSubmitting(true);
        setError(null);

        const requestBody = {
            name: values.name,
            about: values.about,
            teamMembers: values.teamMembers.filter(member => member.trim() !== ""),
            userId: userId,
            timeline: values.timeline.toISOString(),
            links: values.links ? values.links.filter(link => link.trim() !== "") : [],
            citations: values.citations || "",
            goalAmount: values.goalAmount,
            pdfs: pdfs.map(pdf => ({
                name: pdf.name,
                size: pdf.size,
                type: pdf.type,
            })),
        };

        console.log("Request body:", requestBody);

        const response = await axios.post("/api/projects", requestBody);
        console.log("Response:", response);

        router.push("/projects");
        router.refresh();
    } catch (error) {
        console.error("Submission error:", error);
        setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
        setIsSubmitting(false);
    }
}

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, ""]);
  };

  const removeTeamMember = (index: number) => {
    const newTeamMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(newTeamMembers);
  };

  const addLink = () => {
    setLinks([...links, ""]);
  };

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleFileUpload = (files: File[]) => {
    setPdfs(files);
    console.log(files);
  };

  return (
    <div className="p-14">

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter project name"
                      {...field}
                      className="max-w-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Project</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your project"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teamMembers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Members</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {teamMembers.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            placeholder="Enter team member name"
                            value={member}
                            onChange={(e) => {
                              const newTeamMembers = [...teamMembers];
                              newTeamMembers[index] = e.target.value;
                              setTeamMembers(newTeamMembers);
                              field.onChange(newTeamMembers.filter(Boolean));
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeTeamMember(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTeamMember}
                  >
                    <UserRoundPlus className="h-4 w-4" />
                    Add Team Member
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Project Completion Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-[240px] pl-3 text-left font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date > new Date("2100-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="links"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevant Links</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {links.map((link, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            placeholder="https://example.com"
                            value={link}
                            onChange={(e) => {
                              const newLinks = [...links];
                              newLinks[index] = e.target.value;
                              setLinks(newLinks);
                              field.onChange(newLinks.filter(Boolean));
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeLink(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <Button type="button" variant="outline" onClick={addLink}>
                    <Link className="h-4 w-4" />
                    Add Link
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />

             <div className="space-y-2">

        <Label>Citations</Label>
        {citations.map((citation, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              placeholder={`Citation ${index + 1}`}
              value={citation}
              onChange={(e) => {
                const newCitations = [...citations]
                newCitations[index] = e.target.value
                setCitations(newCitations)
              }}
              required
            />
            {index > 0 && (
              <Button type="button" variant="ghost" size="icon" onClick={() => removeCitation(index)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addCitation}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add Citation
        </Button>
      </div>


            <FormField
              control={form.control}
              name="goalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Amount (AVAX)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter goal amount"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full md:w-64 space-y-8">
            <FormField
              control={form.control}
              name="pdfs"
              render={({ field }) => <>
              <FormItem>
                <FormLabel>Attach PDFs</FormLabel>
                <FormControl>
                  <FileUpload onChange={handleFileUpload} Form={form}></FileUpload>
                </FormControl>
              </FormItem>
              <FormMessage/>
              </>}
            ></FormField>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Project"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
    </div>
  );
}
