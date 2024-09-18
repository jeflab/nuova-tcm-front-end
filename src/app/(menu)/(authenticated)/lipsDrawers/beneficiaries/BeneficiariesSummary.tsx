"use client";

import {nominationOptions} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {dateString} from "@/helpers/dates";
import {getOptionsLabel} from "@/helpers/getOptionsLabel";
import {IconStack} from "@/ui/IconStack";
import {
  faAddressBook,
  faCheckSquare,
  faUserCheck,
} from "@fortawesome/pro-duotone-svg-icons";
import {faMessage, faUser} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Fragment} from "react";
import {Col, Row, Stack} from "react-bootstrap";

export function BeneficiariesSummary() {
  const beneficiariesData = useStore((state) => state.lip?.beneficiaries);

  if (!beneficiariesData) {
    return null;
  }

  return (
    <Stack gap={4}>
      {beneficiariesData.nomination === "heirs" ? (
        <p className="mb-0">
          <FontAwesomeIcon icon={faCheckSquare} />{" "}
          {getOptionsLabel(nominationOptions, beneficiariesData.nomination)}
        </p>
      ) : (
        <>
          <p className="mb-0">
            <FontAwesomeIcon icon={faCheckSquare} />{" "}
            {getOptionsLabel(nominationOptions, beneficiariesData.nomination)}
          </p>
          {beneficiariesData.beneficiaries?.map((beneficiary, index) => (
            <Fragment key={beneficiary.fiscalCode}>
              <Row xs={1} sm={2} md={1} lg={2}>
                <Col>
                  <h4 className="w-100 text-primary">
                    <FontAwesomeIcon icon={faUserCheck} /> Beneficiario{" "}
                    {index + 1}
                  </h4>
                  <p className="mb-0">
                    {beneficiary.name} {beneficiary.surname}, nato il{" "}
                    {dateString(new Date(beneficiary.birthDate))} a{" "}
                    {beneficiary.birthPlace.city} (
                    {beneficiary.birthPlace.province})
                  </p>
                  <p>
                    Residente in {beneficiary.streetName}{" "}
                    {beneficiary.streetNumber}, {beneficiary.zipCode}{" "}
                    {beneficiary.place.city} ({beneficiary.place.province})
                  </p>
                  <p className="mb-0">
                    <strong>Codice Fiscale:</strong> {beneficiary.fiscalCode}
                  </p>
                  <p className="mb-0">
                    <strong>Quota:</strong> {beneficiary.share}%
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
              {beneficiariesData.beneficiaries &&
                index < beneficiariesData.beneficiaries.length - 1 && (
                  <hr className="w-100 m-0" />
                )}
            </Fragment>
          ))}
        </>
      )}
      {beneficiariesData.thirdParty &&
        beneficiariesData.thirdPartyContactPerson && (
          <>
            <hr className="w-100 m-0" />
            <Row xs={1} sm={2} md={1} lg={2}>
              <Col>
                <h4 className="w-100 text-primary">
                  <IconStack className="me-2">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="fa-stack-2x"
                      opacity={0.4}
                    />
                    <FontAwesomeIcon
                      icon={faMessage}
                      className="fa-stack-1x"
                      transform="up-7 right-18"
                    />
                  </IconStack>
                  Referente terzo
                </h4>
                <p className="mb-0">
                  {beneficiariesData.thirdPartyContactPerson.name}{" "}
                  {beneficiariesData.thirdPartyContactPerson.surname}, nato il{" "}
                  {dateString(
                    new Date(
                      beneficiariesData.thirdPartyContactPerson.birthDate,
                    ),
                  )}{" "}
                  a {beneficiariesData.thirdPartyContactPerson.birthPlace.city}{" "}
                  (
                  {
                    beneficiariesData.thirdPartyContactPerson.birthPlace
                      .province
                  }
                  )
                </p>
                <p>
                  Residente in{" "}
                  {beneficiariesData.thirdPartyContactPerson.streetName}{" "}
                  {beneficiariesData.thirdPartyContactPerson.streetNumber},{" "}
                  {beneficiariesData.thirdPartyContactPerson.zipCode}{" "}
                  {beneficiariesData.thirdPartyContactPerson.place.city} (
                  {beneficiariesData.thirdPartyContactPerson.place.province})
                </p>
                <p className="mb-0">
                  <strong>Codice Fiscale:</strong>{" "}
                  {beneficiariesData.thirdPartyContactPerson.fiscalCode}
                </p>
              </Col>
              <Col>
                <h4 className="w-100 text-primary">
                  <FontAwesomeIcon icon={faAddressBook} /> Contatti
                </h4>
                <p className="mb-0">
                  <strong>Telefono:</strong>{" "}
                  {beneficiariesData.thirdPartyContactPerson.phone}
                </p>
                <p className="mb-0">
                  <strong>Email:</strong>{" "}
                  {beneficiariesData.thirdPartyContactPerson.email}
                </p>
              </Col>
            </Row>
          </>
        )}
    </Stack>
  );
}
