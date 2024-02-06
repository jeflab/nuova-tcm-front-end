"use client";

import {nominationOptions} from "@/app/(menu)/(authenticated)/lips/[id]/BeneficiariesForm";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {dateString} from "@/helpers/dates";
import {getOptionsLabel} from "@/helpers/getOptionsLabel";
import {
  faAddressBook,
  faCheckSquare,
  faUser,
  faUserCheck,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col, Row, Stack} from "react-bootstrap";

export function BeneficiariesSummary() {
  const beneficiariesData = useDrawerStore(
    (state) => state.lipData.beneficiaries,
  );

  if (!beneficiariesData) {
    return null;
  }

  if (beneficiariesData.nomination === "heirs") {
    return (
      <p className="mb-0">
        <FontAwesomeIcon icon={faCheckSquare} />{" "}
        {getOptionsLabel(nominationOptions, beneficiariesData.nomination)}
      </p>
    );
  }

  return (
    <Stack gap={4}>
      <p className="mb-0">
        <FontAwesomeIcon icon={faCheckSquare} />{" "}
        {getOptionsLabel(nominationOptions, beneficiariesData.nomination)}
      </p>
      {beneficiariesData.beneficiaries.map((beneficiary, index) => (
        <>
          <Row key={beneficiary.fiscalCode} xs={1} sm={2} md={1} lg={2}>
            <Col>
              <h4 className="w-100 text-primary">
                <FontAwesomeIcon icon={faUserCheck} /> Beneficiario {index + 1}
              </h4>
              <p className="mb-0">
                {beneficiary.name} {beneficiary.surname}, nato il{" "}
                {dateString(new Date(beneficiary.birthDate))} a{" "}
                {beneficiary.birthPlace.city} ({beneficiary.birthPlace.province}
                )
              </p>
              <p>
                Residente in {beneficiary.streetName} {beneficiary.streetNumber}
                , {beneficiary.zipCode} {beneficiary.place.city} (
                {beneficiary.place.province})
              </p>
              <p className="mb-0">
                <strong>Codice Fiscale:</strong> {beneficiary.fiscalCode}
              </p>
            </Col>
            <Col>
              <h4 className="w-100 text-primary">
                <FontAwesomeIcon icon={faAddressBook} /> Contatti
              </h4>
              <p className="mb-0">
                <strong>Telefono:</strong> {beneficiary.phone}
              </p>
              <p className="mb-0">
                <strong>Email:</strong> {beneficiary.email}
              </p>
            </Col>
          </Row>
          {index < beneficiariesData.beneficiaries.length - 1 && (
            <hr className="w-100 m-0" />
          )}
        </>
      ))}
    </Stack>
  );
}
