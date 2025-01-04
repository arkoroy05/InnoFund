import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { Progress } from "./ui/progress";
import { ArrowUpRight, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";


interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  name: string;
  about: string;
}
interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => Promise<void>;
}
export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      await onDelete(project.id);
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setIsDeleting(false);
      setShowConfirmation(false);
    }
  };

  const router = useRouter();
  project.currentFunding = project.currentFunding || 0;
  return (
    <div className="bg-neutral-900 hover:border hover:border-neutral-800 rounded-lg">
      <div className="p-6 shadow-md min-w-[20rem]">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full">
            <div className="flex justify-between items-start gap-4 flex-col w-full">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-2xl font-semibold text-neutral-300 flex items-center gap-2">
                  {project.name}
                  <span className="text-stone-400 text-sm border py-1 px-2 rounded-full ml-2 border-stone-600">
                    {project.currentFunding} AVAX
                  </span>
                  <span className="text-lime-400 text-sm border py-1 px-2 rounded-full border-lime-500/70">
                    {project.goalAmount} AVAX
                  </span>{" "}
      
                </h3>
                <div className="flex gap-2">

                  <div className="delete-button min-w-[160px] flex justify-end pointer-events-auto">
                    {!showConfirmation ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowConfirmation(true);
                        }}
                        className="flex justify-center items-center gap-1 text-sm px-2"
                        variant={"destructive"}
                        disabled={isDeleting}
                      >
                        <TrashIcon />Delete
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={handleDelete}
                          disabled={isDeleting}
                          variant={"destructive"}
                          className=""
                        >
                          {isDeleting ? "Deleting..." : "Confirm"}
                        </Button>
                        <Button
                          onClick={() => setShowConfirmation(false)}
                          disabled={isDeleting}
                          variant={"outline"}
                          className="text-sm bg-transparent"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button
                      onClick={() => {
                        router.push(`/projects/${project.id}`);
                      }}
                      className="flex justify-center items-center gap-1 text-sm px-2 bg-transparent"
                      variant={"outline"}
                    >
                      <ArrowUpRight /> Show Project
                    </Button>
                </div>

              </div>
              <Progress
                className="w-full"
                value={project.currentFunding / project.goalAmount}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Created on {formatDate(project.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
