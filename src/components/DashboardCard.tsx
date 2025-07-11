import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import clsx from "clsx";
import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  value: number | string;
  color: "blue" | "green" | "purple" | "orange" | "red" | "yellow";
  icon?: React.ReactNode; // Add icon prop
}

export default function DashboardCard({ title, value, color, icon }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="transition-transform hover:scale-[1.03] shadow-lg rounded-2xl min-h-[150px] flex flex-col justify-between p-4 bg-white">
        <div className="flex items-center gap-4 mb-2">
          {icon && (
            <div className={clsx(
              "rounded-full p-2 flex items-center justify-center text-white text-2xl",
              {
                "bg-blue-500": color === "blue",
                "bg-green-500": color === "green",
                "bg-purple-500": color === "purple",
                "bg-orange-500": color === "orange",
                "bg-red-500": color === "red",
                "bg-yellow-500": color === "yellow",
              }
            )}>
              {icon}
            </div>
          )}
          <CardTitle className="text-lg font-semibold text-gray-800">
            {title}
          </CardTitle>
        </div>
        <CardContent className="p-0">
          <p
            className={clsx("text-4xl font-extrabold", {
              "text-blue-600": color === "blue",
              "text-green-600": color === "green",
              "text-purple-600": color === "purple",
              "text-orange-600": color === "orange",
              "text-red-600": color === "red",
              "text-yellow-600": color === "yellow",
            })}
          >
            {value}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
