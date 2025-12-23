// Modelo de Denuncia
class Complaint {
  constructor() {
    this.complaints = [
      {
        id: "RPT-1001",
        userId: 1,
        category: "obstruccion",
        title: "Vehículo mal estacionado en zona escolar",
        description: "Vehículo gris bloqueando rampa de acceso para discapacitados",
        location: {
          lat: -13.5167,
          lng: -71.9781,
          address: "Av. La Cultura 800, Wanchaq"
        },
        plate: "V1Z-982",
        status: "en_revision",
        evidence: "",
        createdAt: "2024-11-25T10:30:00Z",
        trackingCode: "D-2024-001",
        reference: "Frente al colegio San José"
      }
    ];
  }

  findAll() {
    return this.complaints;
  }

  findById(id) {
    return this.complaints.find(c => c.id === id);
  }

  findByUserId(userId) {
    return this.complaints.filter(c => c.userId === userId);
  }

  create(complaintData) {
    const newComplaint = {
      id: `RPT-${1000 + this.complaints.length + 1}`,
      ...complaintData,
      status: 'pendiente',
      evidence: '',
      createdAt: new Date().toISOString(),
      trackingCode: `D-${new Date().getFullYear()}-${String(this.complaints.length + 1).padStart(3, '0')}`
    };
    
    this.complaints.push(newComplaint);
    return newComplaint;
  }
}

module.exports = new Complaint();