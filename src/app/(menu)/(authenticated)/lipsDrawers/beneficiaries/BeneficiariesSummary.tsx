"use client";

import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {isBeneficiariesValid} from "@/app/(menu)/(authenticated)/lipsDrawers/beneficiaries/beneficiariesValidators";
import {nominationOptions} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
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
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {Fragment} from "react";
import {Col, Row, Stack} from "react-bootstrap";

export function BeneficiariesSummary() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id) as number;
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));

  if (!isBeneficiariesValid(lip)) {
    return null;
  }

  return (
    <Stack gap={4}>
      {lip.beneficiaries.nomination === "heirs" ? (
        <p className="mb-0">
          <FontAwesomeIcon icon={faCheckSquare} />{" "}
          {getOptionsLabel(nominationOptions, lip.beneficiaries.nomination)}
        </p>
      ) : (
        <>
          <p className="mb-0">
            <FontAwesomeIcon icon={faCheckSquare} />{" "}
            {getOptionsLabel(nominationOptions, lip.beneficiaries.nomination)}
          </p>
          {lip.beneficiaries.beneficiaries?.map((beneficiary, index) => (
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
                    <strong>E-Mail:</strong> {beneficiary.email}
                  </p>
                </Col>
              </Row>
              {lip.beneficiaries.beneficiaries &&
                index < lip.beneficiaries.beneficiaries.length - 1 && (
                  <hr className="w-100 m-0" />
                )}
            </Fragment>
          ))}
        </>
      )}
      {lip.beneficiaries.thirdParty &&
        lip.beneficiaries.thirdPartyContactPerson && (
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
                  {lip.beneficiaries.thirdPartyContactPerson.name}{" "}
                  {lip.beneficiaries.thirdPartyContactPerson.surname}, nato il{" "}
                  {dateString(
                    new Date(
                      lip.beneficiaries.thirdPartyContactPerson.birthDate,
                    ),
                  )}{" "}
                  a {lip.beneficiaries.thirdPartyContactPerson.birthPlace.city}{" "}
                  (
                  {
                    lip.beneficiaries.thirdPartyContactPerson.birthPlace
                      .province
                  }
                  )
                </p>
                <p>
                  Residente in{" "}
                  {lip.beneficiaries.thirdPartyContactPerson.streetName}{" "}
                  {lip.beneficiaries.thirdPartyContactPerson.streetNumber},{" "}
                  {lip.beneficiaries.thirdPartyContactPerson.zipCode}{" "}
                  {lip.beneficiaries.thirdPartyContactPerson.place.city} (
                  {lip.beneficiaries.thirdPartyContactPerson.place.province})
                </p>
                <p className="mb-0">
                  <strong>Codice Fiscale:</strong>{" "}
                  {lip.beneficiaries.thirdPartyContactPerson.fiscalCode}
                </p>
              </Col>
              <Col>
                <h4 className="w-100 text-primary">
                  <FontAwesomeIcon icon={faAddressBook} /> Contatti
                </h4>
                <p className="mb-0">
                  <strong>Telefono:</strong>{" "}
                  {lip.beneficiaries.thirdPartyContactPerson.phone}
                </p>
                <p className="mb-0">
                  <strong>E-Mail:</strong>{" "}
                  {lip.beneficiaries.thirdPartyContactPerson.email}
                </p>
              </Col>
            </Row>
          </>
        )}
    </Stack>
  );
}
