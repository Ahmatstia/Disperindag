import { getTamuData } from "@/lib/apps-script";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TamuItem = {
  Timestamp?: string;
  Nama?: string;
  Instansi?: string;
  Keperluan?: string;
  "Bertemu Dengan"?: string;
  [key: string]: any;
};

export default async function TamuPage() {
  const data: TamuItem[] = await getTamuData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-900 mb-2">
          📖 Data Buku Tamu Digital
        </h1>
        <p className="text-gray-600">
          Total {data.length} tamu telah berkunjung
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Kunjungan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Instansi</TableHead>
                <TableHead>Keperluan</TableHead>
                <TableHead>Bertemu Dengan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: TamuItem, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.Timestamp || "-"}</TableCell>
                  <TableCell className="font-medium">
                    {item.Nama || "-"}
                  </TableCell>
                  <TableCell>{item.Instansi || "-"}</TableCell>
                  <TableCell>{item.Keperluan || "-"}</TableCell>
                  <TableCell>{item["Bertemu Dengan"] || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
