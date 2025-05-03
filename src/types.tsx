export interface InvitationData {
  groom: string;
  bride: string;
  groomFather: string;
  groomMother: string;
  brideFather: string;
  brideMother: string;
  date: string;
  akadDate: string;
  receptionDate: string;
  akadTime: string;
  receptionTime: string;
  akadLocation: string;
  receptionLocation: string;
  address: string;
  location: string;
  mapLink: string;
  template: string;
  guests: string[];
  photoLink: string;
  musicLink: string;
}

export interface GeneratedLink {
  guest: string;
  link: string;
}