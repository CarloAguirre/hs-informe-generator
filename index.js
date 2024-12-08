const express = require("express");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYjQzMTUwMzAyYjA2ZTRjMWExNzBhMzg2OGJiMmQ2NzQyZjBlOTZlN2YzOTc2YjdmY2I1ZDEwZWJiMTRmMWI0MzhkN2Y3YzU5Y2RkYjE3NzkiLCJpYXQiOjE3MzM0MzI3MTUuODA1OTYzLCJuYmYiOjE3MzM0MzI3MTUuODA1OTY0LCJleHAiOjQ4ODkxMDYzMTUuODAyMywic3ViIjoiNzAzODEyMTgiLCJzY29wZXMiOlsidXNlci5yZWFkIiwidXNlci53cml0ZSIsInRhc2sucmVhZCIsInRhc2sud3JpdGUiLCJ3ZWJob29rLnJlYWQiLCJ3ZWJob29rLndyaXRlIiwicHJlc2V0LnJlYWQiLCJwcmVzZXQud3JpdGUiXX0.GYrPGxYxHAtgXnjZRDu6fsb2bVq9hcFlMgs_vi4YfY8L8Lf18Ljdmdy3q5n7VeVdsIz51wwSL5I1Dl3gg9lGDVoYiiWe9US99DHRx2WV-JZPBxgut0Lf6899OBuLqzJ0EsrA0Jc-n_kSdiMG_Pw_M8gHx2pydoKdgdJ5Uqvw_zWZhDEdvUlobAMBOyYJw8_fBIo2b7c_xXHH_JXC_-dxESePEq1VTLiUkrE6iQu0FHqIAXWf-8DPc1GyTsWltAbPeFTgeAVVLI2Ql4zmwYQ-H-IOSAkzjnO_pdIpxHld94yGjzWh2bDEc9zZtR1kYlwAPjEBM_tG5zVTmpfXU1ftiUjzma10nEn3ZsfA1yZDKjcLmPgJp-Yygj1uFEGEqb8_5DAyA0PLa2WZrm-_Y_TYD7tehhqkQzo-uGiy04XhnO0Gn9pGSbwr6HJn4dLnXm9gsYabn2aLbg_WxtZtSppif_f-nF2pl4rflVsslIQ00y10D0PH4dQe9_lHM6JuKUGSFZAgihfzeUHH5aSpdoQcHNVFB_MuJT0BZpSN8nwAy9UGb9VfBxKCUnoJK10KeKYs0Ce_DcBdWdAFGbzuvnv_7OboSj2ARyYoGmNZtqAjVIO1kF4EhaWdV2mojnClSnzScooWmWB3jKc9Qw5dSwtebxvXSb5WkaQw735RuHkNysA"; 
const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZDY5YWI3NTU5MTZmOTVlMzI5YjA1MzA3NjZjZTIyZWNhMTA2NDBjNTg4ZTE1ZWZlMDFlMWUyMjRhZmMxNWIzYjg0OTQ5MDllNTg0NDUwZjIiLCJpYXQiOjE3MzM2Njg1ODIuNDg5NTI5LCJuYmYiOjE3MzM2Njg1ODIuNDg5NTMxLCJleHAiOjQ4ODkzNDIxODIuNDY4NjgsInN1YiI6IjcwMzM2NjI5Iiwic2NvcGVzIjpbInVzZXIucmVhZCIsInVzZXIud3JpdGUiLCJ0YXNrLnJlYWQiLCJ0YXNrLndyaXRlIiwid2ViaG9vay5yZWFkIiwid2ViaG9vay53cml0ZSIsInByZXNldC5yZWFkIiwicHJlc2V0LndyaXRlIl19.ZXcbEp5JRioGaH7QNYtl2X-I-Gvi_VCO_hiq9eyi_LOnC2vwcHqVMJ_iF4s_a1Z-jtPbdbAYriQL4n46G02Mi7YlSzNOjX0-aYdZmwAwuf06q5QWS0lkJnrbyjHiHkQOQAupRh2RUBsqOQbqmMhKVGOdB15CkfHelnQAYM3Z0z4s8n9TAM5SiAMx58xvPIOg0ZLevkksaolNVKdQD-3aROPzHB4He0m9v1-gIr3IGeGpgX4ho7tOP8h2o8jO0bn_9htz4_sWZJRCXJDHhIsXvGIN2Fg8VhktNF7E5reljjjuZ-qzOl0WEeQqwTzE8MInJf_Owk-nKWIh-L_IumZLQrC_4aSLKTAkOGCjkwwvjOrfIo1PhZlNTws7y8uI9L7JeT7n4IO_Cdz49KHesRsdrMLXKLXkSueRkisCdq40tMvOgHdwqtvT0N8vppdQu1Ks4XB7bLmOscm7tW3VIe3Dxr5M0WJCZ749AM6FDGsTHKNHoQ0BPDl7i6e8mwlI7IVGb1CzWljOxNQkCvy_5NLxI7-Y7_JbVXjR8wjxS07M8A1GCc7ZRcWj64mwj0XTdmPyqJF8bfWoeHiDAPcXF74HoOBHlr3iSKGJo52zEQwXyQQ9kUtWWzFY4b7BcDGe46dGBo_BMQDEOII_WWRN9VyVNTM-SQdeEqzeI4VTfN5Z2HM"; 
const INPUT_DOCX = path.join(__dirname, "informe.docx");

app.post("/", async (req, res) => {
  const {
    totalEmisiones,
    porcentajeScopeUno,
    porcentajeScopeDos,
    porcentajeScopeTres,
    totalScopeUno,
    totalScopeDos,
    totalScopeTres,
    principalFuenteUno,
    principalFuenteDos,
    principalFuenteTres,
    principalFuenteUnoTotal,
    principalFuenteDosTotal,
    principalFuenteTresTotal,
    principalFuenteUnoPorcentaje,
    principalFuenteDosPorcentaje,
    principalFuenteTresPorcentaje,
    fechaHoy,
    fechaInicioString,
    fechaFinString,
    fechaInicioFormatted,
    fechaFinFormatted,
    establecimientos,
    categorias 
  } = req.body;

  if (!totalEmisiones) {
    return res.status(400).json({ error: "El campo totalEmisiones es requerido" });
  }

  console.log(categorias)

  const establecimientosFormatted = establecimientos
  .map((e) => `• ${e.address.name}`)
  .join('\n');

  

  try {
    const content = fs.readFileSync(INPUT_DOCX);
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    const alcanceMap = {
      alcanceUno: "Scope 1",
      alcanceDos: "Scope 2",
      alcanceTres: "Scope 3",
    };
    const tablaDatos = categorias.map((categoria) => ({
      key: categoria.key,
      alcance: alcanceMap[categoria.alcance.trim()] || categoria.alcance.trim(),
      value: Number(categoria.value/1000).toFixed(2),
      porcentaje: `${Number(categoria.porcentaje).toFixed(2)}%`,
    }));
    doc.render({
      totalEmisiones,
      porcentajeScopeUno,
      porcentajeScopeDos,
      porcentajeScopeTres,
      totalScopeUno,
      totalScopeDos,
      totalScopeTres,
      principalFuenteUno,
      principalFuenteDos,
      principalFuenteTres,
      principalFuenteUnoTotal,
      principalFuenteDosTotal,
      principalFuenteTresTotal,
      principalFuenteUnoPorcentaje,
      principalFuenteDosPorcentaje,
      principalFuenteTresPorcentaje,
      fechaHoy,
      fechaInicioString,
      fechaFinString,
      fechaInicioFormatted,
      fechaFinFormatted,
      establecimientosFormatted,
      tabla: tablaDatos,
    });

    // Guardar el Word modificado
    const modifiedDocxPath = path.join(__dirname, "informe_modificado.docx");
    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    fs.writeFileSync(modifiedDocxPath, buffer);

    const fileData = fs.readFileSync(modifiedDocxPath).toString("base64");
    const payload = {
      tasks: {
        "import-my-file": {
          operation: "import/base64",
          file: fileData,
          filename: "informe_modificado.docx",
        },
        "convert-my-file": {
          operation: "convert",
          input: "import-my-file",
          input_format: "docx",
          output_format: "pdf",
        },
        "export-my-file": {
          operation: "export/url",
          input: "convert-my-file",
        },
      },
    };

    const response = await axios.post(
      "https://api.cloudconvert.com/v2/jobs",
      payload,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const jobId = response.data.data.id;

    const pdfUrl = await waitForExportResult(jobId);
    console.log("PDF URL generado:", pdfUrl);
    const pdfResponse = await axios.get(pdfUrl, { responseType: "arraybuffer" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="informe_modificado.pdf"'
    );
    res.send(pdfResponse.data);

    fs.unlink('informe_modificado.docx', (err) => {
      if (err) {
        console.error('Error al eliminar el archivo:', err);
        return;
      }
      console.log('Archivo eliminado con éxito');
    });

  } catch (error) {
    console.error("Error en el proceso:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error interno en el servidor",
      error: error.response?.data || error.message,
    });
  }
});

async function waitForExportResult(jobId) {
  const MAX_RETRIES = 10; 
  const DELAY_MS = 1000; 

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const jobStatusResponse = await axios.get(
      `https://api.cloudconvert.com/v2/jobs/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const tasks = jobStatusResponse.data.data.tasks;
    const exportTask = tasks.find((task) => task.name === "export-my-file");

    if (exportTask && exportTask.status === "finished" && exportTask.result) {
      return exportTask.result.files[0].url; 
    }

    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  }

  throw new Error("La tarea de exportación no se completó a tiempo.");
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
