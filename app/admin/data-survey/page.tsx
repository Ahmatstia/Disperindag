import { getSurveyData } from "@/lib/apps-script";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Tipe untuk data survey
type SurveyItem = {
  Timestamp?: string;
  Nama?: string;
  Pekerjaan?: string;
  "Jenis Kelamin"?: string;
  Kepuasan?: string;
  [key: string]: any;
};

export default async function SurveyPage() {
  const data: SurveyItem[] = await getSurveyData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          📋 Data Survey Kepuasan
        </h1>
        <p className="text-gray-600">
          Total {data.length} responden telah mengisi survey
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Responden</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Pekerjaan</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Kepuasan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: SurveyItem, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.Timestamp || "-"}</TableCell>
                  <TableCell className="font-medium">
                    {item.Nama || "-"}
                  </TableCell>
                  <TableCell>{item.Pekerjaan || "-"}</TableCell>
                  <TableCell>{item["Jenis Kelamin"] || "-"}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {item.Kepuasan ? `${item.Kepuasan}/5` : "-"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
