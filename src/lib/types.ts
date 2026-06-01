export interface CoachSettings {
  orgName: string;
  coachName: string;
  coachEmail: string;
  coachPhone: string;
  teamName: string;
  logoDataUrl: string;
}

export interface PlayerData {
  firstName: string;
  lastName: string;
  age: string;
  school: string;
  position: string;
  jerseyNumber: string;
  jerseySize: string;
  throws: 'Right' | 'Left';
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  emergencyName: string;
  emergencyPhone: string;
  medicalNotes: string;
  paymentAmount: string;
  paymentStatus: 'Pending' | 'Paid';
}
