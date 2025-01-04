"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, UserRoundPlus, X } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Project title must be at least 2 characters.",
  }),
  desc: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  field: z.string().min(2, {
    message: "Field of research is required.",
  }),
  potentialImpact: z.string().min(10, {
    message: "Potential impact description must be at least 10 characters.",
  }),
  team: z.array(z.string().min(1, "Team member name cannot be empty")),
  teamSize: z.number().min(1, {
    message: "Team size must be at least 1.",
  }),
  currentFunding: z.number().default(0),
  goalFunding: z.number().positive({
    message: "Goal funding amount must be a positive number.",
  }),
  author: z.object({
    username: z.string(),
    name: z.string(),
    credentials: z.string(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateResearchFundingForm() {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      desc: "",
      field: "",
      potentialImpact: "",
      team: [""],
      teamSize: 1,
      currentFunding: 0,
      goalFunding: 0,
      author: {
        username: "",
        name: "",
        credentials: "",
      },
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
        team: values.team.filter(member => member.trim() !== ""),
        timeposted: new Date().toISOString(),
      };

      if (cleanedValues.team.length === 0) {
        setError("At least one team member is required");
        return;
      }

      const requestBody = {
        ...cleanedValues,
        userId,
      };

      await axios.post("/api/research-projects", requestBody);
      router.push("/projects");
      router.refresh();
    } catch (error) {
      console.error("Submission error:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter research project title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your research project"
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
            name="field"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Research Field</FormLabel>
                <FormControl>
                  <Input placeholder="Enter research field" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="potentialImpact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Potential Impact</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the potential impact of your research"
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
            name="team"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Members</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {field.value.map((member, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder="Enter team member name"
                          value={member}
                          onChange={(e) => {
                            const newValue = [...field.value];
                            newValue[index] = e.target.value;
                            field.onChange(newValue);
                            form.setValue("teamSize", newValue.length);
                          }}
                        />
                        {field.value.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newValue = field.value.filter((_, i) => i !== index);
                              field.onChange(newValue);
                              form.setValue("teamSize", newValue.length);
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
                  onClick={() => {
                    const newValue = [...field.value, ""];
                    field.onChange(newValue);
                    form.setValue("teamSize", newValue.length);
                  }}
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
            name="goalFunding"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Funding Goal (AVAX)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter funding goal amount"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Author Information</h3>
            <FormField
              control={form.control}
              name="author.username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author.credentials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credentials</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your credentials" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish Research Project"}
          </Button>
        </form>
      </Form>
    </div>
  );
}