import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRequestStatus, listallRequests } from "@/http/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // ✅ NEW
import { toast } from "sonner";
import { useState } from "react";
//import { useQuery } from "@tanstack/react-query";

interface RequestItem {
  _id: string;
  status: "PENDING" | "APPROVED" | "CANCELLED";
  pdfId?: { title?: string };
  userId?: { name?: string };
}

const getStatusBadge = (status: RequestItem["status"]) => {
  switch (status) {
    case "PENDING":
      return <Badge variant="secondary">Pending</Badge>;
    case "APPROVED":
      return <Badge variant="default">Approved</Badge>;
    case "CANCELLED":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const RequestsPage = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["requests", page],
    queryFn: () => listallRequests(page, 10),
    gcTime: 0,
  });
  console.log("Requesting page:", page);

  const { mutate: changeStatus, isPending } = useMutation({
    mutationFn: ({
      requestId,
      status,
    }: {
      requestId: string;
      status: "APPROVED" | "CANCELLED";
    }) => deleteRequestStatus({ requestId, status }),
    onSuccess: (res) => {
      console.log("Mutation success:", res);
      toast.success(res.data.message);
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["pdfs"] });
    },
    onError: (err: unknown) => {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response
      ) {
        const errorMessage = (
          err as { response: { data: { message?: string } } }
        ).response.data.message;
        toast.error(errorMessage || "Something went wrong.");
      } else {
        toast.error("Something went wrong.");
      }
    },
  });

  if (isLoading)
    return <div className="p-4 text-muted-foreground">Loading requests...</div>;

  //const requests: RequestItem[] = data?.data?.items || [];
  const requests: RequestItem[] = data?.data?.data || [];

  console.log("Full API Response:", data);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">All Requests</h2>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PDF Title</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.pdfId?.title || "N/A"}</TableCell>
                  <TableCell>{request.userId?.name || "N/A"}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={request.status !== "PENDING" || isPending}
                      onClick={() =>
                        changeStatus({
                          requestId: request._id,
                          status: "APPROVED",
                        })
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={request.status !== "PENDING" || isPending}
                      onClick={() =>
                        changeStatus({
                          requestId: request._id,
                          status: "CANCELLED",
                        })
                      }
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={requests.length < 10}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default RequestsPage;
