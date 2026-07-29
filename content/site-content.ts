import { Blocks, Bot, Braces, ChartNoAxesCombined, CircuitBoard, Database, GitMerge, MessagesSquare } from "lucide-react";
export const services = [
  { title: "Desarrollo de software", description: "Aplicaciones web, paneles y sistemas diseñados para procesos específicos.", icon: Braces, details: ["Aplicaciones web", "Paneles y dashboards", "Sistemas internos", "APIs y plataformas a medida"] },
  { title: "Automatización de procesos", description: "Flujos que conectan tareas, eventos, reglas y notificaciones.", icon: GitMerge, details: ["Tareas repetitivas", "Flujos de trabajo", "Notificaciones y seguimiento", "Procesamiento de datos"] },
  { title: "CRM y atención comercial", description: "Información, seguimiento y conversaciones organizadas en un solo entorno.", icon: ChartNoAxesCombined, details: ["Clientes e historial", "Etapas de venta", "Tareas y seguimiento", "Segmentación y métricas"] },
  { title: "Integración de canales", description: "Canales de atención conectados con procesos y datos empresariales.", icon: MessagesSquare, details: ["Mensajería", "Correo y formularios", "Calendarios", "Historial centralizado"] },
  { title: "Inteligencia artificial aplicada", description: "Asistentes y análisis con criterios de control y supervisión humana.", icon: Bot, details: ["Clasificación", "Asistentes", "Generación de respuestas", "Análisis de información"] },
  { title: "Sistemas internos", description: "Herramientas para ordenar inventario, operaciones, tareas y administración.", icon: Blocks, details: ["Operaciones", "Inventario", "Roles y permisos", "Trazabilidad"] },
  { title: "Integraciones API", description: "Conexión segura entre plataformas, webhooks y bases de datos.", icon: CircuitBoard, details: ["APIs y webhooks", "Bases de datos", "Pagos", "Servicios empresariales"] },
  { title: "Plataformas SaaS", description: "Arquitecturas modulares para servicios digitales escalables.", icon: Database, details: ["Multiempresa", "Usuarios y roles", "Módulos conectados", "Operación gradual"] },
];
export const workflow = ["Diagnóstico", "Diseño de solución", "Desarrollo", "Integración", "Pruebas", "Implementación", "Soporte y mejora"];
export const solutions = [
  ["Atención al cliente","Conversaciones dispersas y sin contexto.","Centralización de contactos, historial y tareas.","Atención más ordenada y trazable.","Depende de los canales habilitados y sus políticas."],
  ["Ventas","Oportunidades sin seguimiento consistente.","CRM, etapas, recordatorios y automatizaciones.","Mayor visibilidad del proceso comercial.","Requiere definición de etapas y adopción del equipo."],
  ["Operaciones","Procesos manuales difíciles de controlar.","Flujos, estados, permisos y paneles internos.","Ejecución más uniforme y auditable.","El alcance se define tras levantar el proceso."],
  ["Inventario","Movimientos y existencias en registros separados.","Sistema central de productos, movimientos y alertas.","Información operacional más consistente.","La calidad depende de registros y procedimientos de entrada."],
  ["Reservas","Coordinación manual de horarios y confirmaciones.","Calendarios, disponibilidad, formularios y avisos.","Agenda centralizada y menos trabajo repetitivo.","Sujeto a disponibilidad de APIs de calendario."],
  ["Seguimiento","Casos, pedidos o solicitudes sin trazabilidad.","Estados, responsables, eventos y notificaciones.","Visibilidad del avance y próximos pasos.","Requiere reglas y responsables claramente definidos."],
  ["Reportes","Datos distribuidos y preparación manual.","Consolidación, métricas y paneles de consulta.","Lectura más clara para la toma de decisiones.","La precisión depende de las fuentes disponibles."],
  ["Automatización administrativa","Tareas repetitivas consumen tiempo operativo.","Reglas, integraciones y ejecución supervisada.","Menor carga manual y procesos consistentes.","Las excepciones críticas mantienen revisión humana."],
  ["Comunicación multicanal","Canales aislados generan pérdida de contexto.","Bandeja central y asociación con clientes y procesos.","Continuidad entre canales y equipos.","Sujeto a permisos y aprobaciones de cada plataforma."],
  ["Integración de datos","Sistemas que no comparten información.","APIs, webhooks y procesos de sincronización.","Datos disponibles donde la operación los necesita.","Depende del acceso técnico de cada sistema."],
] as const;
