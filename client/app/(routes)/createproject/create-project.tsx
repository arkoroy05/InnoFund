"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// @ts-ignore
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import { CalendarIcon, PlusCircle, X, Link, UserRoundPlus } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
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
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  designation: z.string().min(1, {
    message: "Project designation is required.",
  }),
  about: z.string().min(10, {
    message: "About section must be at least 10 characters.",
  }),
  teamMembers: z.array(z.string().min(1, "Team member name cannot be empty")),
  timeline: z.date({
    required_error: "Please select a completion date.",
  }),
  links: z
    .array(z.string().url({ message: "Please enter a valid URL." }))
    .default([]),
  citations: z.array(z.string()).default([]),
  goalAmount: z
    .number()
    .positive({
      message: "Goal amount must be a positive number.",
    })
    .max(10, {
      message: "Goal amount cannot be greater than 10.",
    }),
  pdfs: z
    .array(
      z.object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
      })
    )
    .default([]),
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
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      designation: "",
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
    if (!userId) {
      setError("Please login to create a project");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const cleanedValues = {
        ...values,
        teamMembers: values.teamMembers.filter(
          (member) => member.trim() !== ""
        ),
        links: values.links.filter((link) => link.trim() !== ""),
        citations: values.citations.filter(
          (citation) => citation.trim() !== ""
        ),
      };

      if (cleanedValues.teamMembers.length === 0) {
        setError("At least one team member is required");
        return;
      }

      const requestBody = {
        ...cleanedValues,
        userId,
        timeline: values.timeline.toISOString(),
      };

      await axios.post("/api/projects", requestBody);
      router.push("/projects");
      router.refresh();
    } catch (error) {
      console.error("Submission error:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileUpload = (files: File[]) => {
    const fileData = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    form.setValue("pdfs", fileData);
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 ">
      <h1 className="text-4xl font-bold mb-6">Create New Project</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="designation"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Project Designation</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project designation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rest of the form fields remain the same */}
          <FormField
            control={form.control}
            name="about"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>About Project</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your project"
                    className="min-h-[100px]"
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
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Team Members</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {field.value.map((member: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder="Enter team member name"
                          value={member}
                          onChange={(e) => {
                            const newValue = [...field.value];
                            newValue[index] = e.target.value;
                            field.onChange(newValue);
                          }}
                        />
                        {field.value.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newValue = field.value.filter(
                                (_: any, i: number) => i !== index
                              );
                              field.onChange(newValue);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => field.onChange([...field.value, ""])}
                  className="mt-2"
                >
                  <UserRoundPlus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeline"
            render={({ field }: any) => (
              <FormItem className="flex flex-col">
                <FormLabel>Project Completion Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
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
                    className="rounded-md border"
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
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Relevant Links</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {field.value.map((link: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder="https://example.com"
                          value={link}
                          onChange={(e) => {
                            const newValue = [...field.value];
                            newValue[index] = e.target.value;
                            field.onChange(newValue);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newValue = field.value.filter(
                              (_: any, i: number) => i !== index
                            );
                            field.onChange(newValue);
                          }}
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
                  onClick={() => field.onChange([...field.value, ""])}
                  className="mt-2"
                >
                  <Link className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="citations"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Citations</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {field.value.map((citation: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder={`Citation ${index + 1}`}
                          value={citation}
                          onChange={(e) => {
                            const newValue = [...field.value];
                            newValue[index] = e.target.value;
                            field.onChange(newValue);
                          }}
                        />
                        {field.value.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newValue = field.value.filter(
                                (_: any, i: number) => i !== index
                              );
                              field.onChange(newValue);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => field.onChange([...field.value, ""])}
                  className="mt-2"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Citation
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goalAmount"
            render={({ field }: any) => (
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

          <FormField
            control={form.control}
            name="pdfs"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Attach PDFs</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center justify-center border p-5 rounded-lg pb-9">
                    <FileUpload onChange={handleFileUpload} Form={form} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish Project"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
