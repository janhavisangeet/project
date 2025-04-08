import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPdfs } from "@/http/api";
import { Pdf } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { CirclePlus, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PdfsPage = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pdfs", { month, year, page }],
    queryFn: () => getPdfs({ month, year, page, limit }),
    staleTime: 10000,
  });

  const handleMonthChange = (value: string) => {
    let monthValue = value == "all" ? "" : value;
    setMonth(monthValue);
    setPage(1);
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    setPage(1);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>PDFs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Link to="/dashboard/pdfs/create">
          <Button>
            <CirclePlus size={20} />
            <span className="ml-2">Add PDF</span>
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mt-6 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Month</label>
          <Select value={month} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Year</label>
          <Input
            type="number"
            value={year}
            onChange={(e) => handleYearChange(e.target.value)}
            placeholder="e.g. 2024"
            className="w-[120px]"
          />
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>PDFs</CardTitle>
          <CardDescription>Manage your uploaded PDF files.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div className="text-red-500">Error loading PDFs.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Uploaded At</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.data.map((pdf: Pdf) => (
                  <TableRow key={pdf._id}>
                    <TableCell>{pdf.month}</TableCell>
                    <TableCell>{Number(pdf.year)}</TableCell>
                    <TableCell>
                      {new Date(pdf.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <a
                        href={pdf.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View PDF
                      </a>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            Showing {data?.data?.data?.length || 0} PDFs
          </div>
          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Prev
            </Button>
            <span className="text-sm">Page {page}</span>
            <Button
              size="sm"
              variant="outline"
              disabled={
                !data?.data?.pagination?.totalPages || // no pages at all
                data?.data?.pagination.totalPages === page // last page
              }
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PdfsPage;
