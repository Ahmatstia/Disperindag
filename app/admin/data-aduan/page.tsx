import { getAduanData } from "@/lib/apps-script";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AduanItem = {
  Timestamp?: string;
  Nama?: string;
  "No HP"?: string;
  Kategori?: string;
  "Isi Aduan"?: string;
  Status?: string;
  [key: string]: any;
};

export default async function AduanPage() {
  const data: AduanItem[] = await getAduanData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-red-900 mb-2">
          📢 Data Layanan Aduan
        </h1>
        <p className="text-gray-600">Total {data.length} aduan telah masuk</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Aduan Masyarakat</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>No HP</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Isi Aduan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: AduanItem, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.Timestamp || "-"}</TableCell>
                  <TableCell className="font-medium">
                    {item.Nama || "-"}
                  </TableCell>
                  <TableCell>{item["No HP"] || "-"}</TableCell>
                  <TableCell>{item.Kategori || "-"}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {item["Isi Aduan"] || "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.Status === "selesai"
                          ? "bg-green-100 text-green-800"
                          : item.Status === "diproses"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.Status || "pending"}
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
