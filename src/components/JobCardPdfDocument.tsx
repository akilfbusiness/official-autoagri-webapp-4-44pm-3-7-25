import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { JobCard } from '../types/JobCard';

interface JobCardPdfDocumentProps {
  jobCard: JobCard;
}

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontSize: 9,
    fontFamily: 'Helvetica',
    lineHeight: 1.3,
  },
  header: {
    marginBottom: 15,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 10,
    color: '#6b7280',
  },
  section: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    width: '35%',
    fontWeight: 'bold',
    color: '#374151',
    fontSize: 8,
  },
  value: {
    width: '65%',
    color: '#1f2937',
    fontSize: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  gridItem: {
    width: '50%',
    marginBottom: 3,
    paddingRight: 5,
  },
  table: {
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    padding: 3,
    fontWeight: 'bold',
    fontSize: 7,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    padding: 3,
    fontSize: 7,
  },
  tableCell: {
    flex: 1,
    fontSize: 7,
    paddingRight: 2,
  },
  tableCellSmall: {
    width: '12%',
    fontSize: 7,
    paddingRight: 2,
  },
  tableCellMedium: {
    width: '20%',
    fontSize: 7,
    paddingRight: 2,
  },
  tableCellLarge: {
    width: '30%',
    fontSize: 7,
    paddingRight: 2,
  },
  // Service Progress specific table cells
  serviceTaskCell: {
    width: '25%',
    fontSize: 7,
    paddingRight: 2,
  },
  serviceStatusCell: {
    width: '8%',
    fontSize: 7,
    textAlign: 'center',
    paddingRight: 2,
  },
  serviceDescriptionCell: {
    width: '30%',
    fontSize: 7,
    paddingRight: 2,
  },
  serviceDoneByCell: {
    width: '20%',
    fontSize: 7,
    paddingRight: 2,
  },
  serviceHoursCell: {
    width: '12%',
    fontSize: 7,
    textAlign: 'center',
    paddingRight: 2,
  },
  // Lubricants specific table cells
  lubricantTaskCell: {
    width: '18%',
    fontSize: 7,
    paddingRight: 2,
  },
  lubricantGradeCell: {
    width: '10%',
    fontSize: 7,
    textAlign: 'center',
    paddingRight: 2,
  },
  lubricantQtyCell: {
    width: '10%',
    fontSize: 7,
    textAlign: 'center',
    paddingRight: 2,
  },
  lubricantCostCell: {
    width: '12%',
    fontSize: 7,
    textAlign: 'right',
    paddingRight: 2,
  },
  lubricantTotalCell: {
    width: '12%',
    fontSize: 7,
    textAlign: 'right',
    paddingRight: 2,
  },
  lubricantRemarksCell: {
    width: '38%',
    fontSize: 7,
    paddingRight: 2,
  },
  imageContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  image: {
    width: 120,
    height: 80,
    objectFit: 'contain',
    border: 1,
    borderColor: '#e5e7eb',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageItem: {
    width: '48%',
    marginBottom: 8,
  },
  imageLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#374151',
  },
  signatureContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    padding: 8,
    border: 1,
    borderColor: '#e5e7eb',
    minHeight: 60,
  },
  signatureLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#374151',
  },
  signatureImage: {
    width: '100%',
    height: 50,
    objectFit: 'contain',
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: 2,
    borderRadius: 2,
    fontSize: 7,
    textAlign: 'center',
    width: 50,
  },
  archivedBadge: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
  },
  totalBox: {
    backgroundColor: '#dbeafe',
    padding: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  declarationBox: {
    backgroundColor: '#fef3c7',
    padding: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  declarationText: {
    fontSize: 8,
    color: '#92400e',
  },
  trailerSectionHeader: {
    backgroundColor: '#f0f9ff',
    padding: 4,
    marginTop: 8,
    marginBottom: 3,
    borderRadius: 3,
  },
  trailerSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  noDataText: {
    fontSize: 8,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
  },
});

export const JobCardPdfDocument: React.FC<JobCardPdfDocumentProps> = ({ jobCard }) => {
  const formatDate = (date?: Date) => {
    if (!date) return 'Not set';
    return date.toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '$0.00';
    return `$${amount.toFixed(2)}`;
  };

  // Calculate Total B from parts and consumables
  const calculateTotalB = () => {
    if (!jobCard.parts_and_consumables) return 0;
    return jobCard.parts_and_consumables.reduce((sum, part) => sum + (part.total_cost_aud || 0), 0);
  };

  const totalB = calculateTotalB();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AutoAgri Australia - Job Card</Text>
          <Text style={styles.subtitle}>Professional Vehicle Service Report</Text>
        </View>

        {/* Job Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Information</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Job Number:</Text>
                <Text style={styles.value}>{jobCard.job_number || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Status:</Text>
                <View style={[styles.statusBadge, jobCard.is_archived && styles.archivedBadge]}>
                  <Text>{jobCard.is_archived ? 'Archived' : 'Active'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Start Date:</Text>
                <Text style={styles.value}>{formatDate(jobCard.job_start_date)}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Expected Completion:</Text>
                <Text style={styles.value}>{formatDate(jobCard.expected_completion_date)}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Completed Date:</Text>
                <Text style={styles.value}>{formatDate(jobCard.completed_date)}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Service Type:</Text>
                <Text style={styles.value}>{jobCard.service_selection || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Approximate Cost:</Text>
                <Text style={styles.value}>{formatCurrency(jobCard.approximate_cost)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Customer Declaration */}
        {jobCard.customer_declaration_authorized !== undefined && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Declaration</Text>
            <View style={styles.declarationBox}>
              <Text style={styles.declarationText}>
                Customer Authorization: {jobCard.customer_declaration_authorized ? 'AUTHORIZED' : 'NOT AUTHORIZED'}
              </Text>
            </View>
          </View>
        )}

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{jobCard.customer_name || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Company:</Text>
                <Text style={styles.value}>{jobCard.company_name || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Mobile:</Text>
                <Text style={styles.value}>{jobCard.mobile || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{jobCard.email || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>ABN:</Text>
                <Text style={styles.value}>{jobCard.abn || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Vehicle Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Make/Model:</Text>
                <Text style={styles.value}>{`${jobCard.vehicle_make || ''} ${jobCard.vehicle_model || ''}`.trim() || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Year/Month:</Text>
                <Text style={styles.value}>{jobCard.vehicle_year ? `${jobCard.vehicle_month || 'N/A'}/${jobCard.vehicle_year}` : 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Registration:</Text>
                <Text style={styles.value}>{jobCard.rego || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>State:</Text>
                <Text style={styles.value}>{jobCard.vehicle_state || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>VIN:</Text>
                <Text style={styles.value}>{jobCard.vin || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Kilometers:</Text>
                <Text style={styles.value}>{jobCard.vehicle_kms ? `${jobCard.vehicle_kms} km` : 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Fuel Type:</Text>
                <Text style={styles.value}>{jobCard.fuel_type || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Vehicle Type:</Text>
                <Text style={styles.value}>{jobCard.vehicle_type?.join(', ') || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Tyre Size:</Text>
                <Text style={styles.value}>{jobCard.tyre_size || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Next Service KMs:</Text>
                <Text style={styles.value}>{jobCard.next_service_kms ? `${jobCard.next_service_kms} km` : 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Assignment Information */}
        {(jobCard.assigned_worker || jobCard.assigned_parts) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assignments</Text>
            <View style={styles.grid}>
              {jobCard.assigned_worker && (
                <View style={styles.gridItem}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Assigned Worker:</Text>
                    <Text style={styles.value}>
                      {jobCard.assigned_worker} 
                      {jobCard.is_worker_assigned_complete ? ' (Complete)' : ' (In Progress)'}
                    </Text>
                  </View>
                </View>
              )}
              {jobCard.assigned_parts && (
                <View style={styles.gridItem}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Assigned Parts:</Text>
                    <Text style={styles.value}>
                      {jobCard.assigned_parts}
                      {jobCard.is_parts_assigned_complete ? ' (Complete)' : ' (In Progress)'}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      </Page>

      {/* Second Page - Service Progress and Tasks */}
      <Page size="A4" style={styles.page}>
        {/* Service Progress */}
        {jobCard.service_progress && jobCard.service_progress.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Progress ({jobCard.service_selection || 'Service Tasks'})</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.serviceTaskCell}>Task</Text>
                <Text style={styles.serviceStatusCell}>Status</Text>
                <Text style={styles.serviceDescriptionCell}>Description</Text>
                <Text style={styles.serviceDoneByCell}>Done By</Text>
                <Text style={styles.serviceHoursCell}>Hours</Text>
              </View>
              {jobCard.service_progress.map((task, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.serviceTaskCell}>{task.task_name || '-'}</Text>
                  <Text style={styles.serviceStatusCell}>
                    {task.status === 'tick' ? 'YES' : task.status === 'no' ? 'NO' : task.status === 'na' ? 'N/A' : '-'}
                  </Text>
                  <Text style={styles.serviceDescriptionCell}>{task.description || '-'}</Text>
                  <Text style={styles.serviceDoneByCell}>{task.done_by || '-'}</Text>
                  <Text style={styles.serviceHoursCell}>{task.hours || '-'}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Trailer Task List */}
        {jobCard.trailer_progress && jobCard.trailer_progress.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trailer Task List</Text>
            {jobCard.trailer_progress.map((trailer, index) => (
              <View key={index}>
                {/* Basic Information */}
                <View style={styles.grid}>
                  <View style={styles.gridItem}>
                    <View style={styles.row}>
                      <Text style={styles.label}>Date:</Text>
                      <Text style={styles.value}>{formatDate(trailer.trailer_date)}</Text>
                    </View>
                  </View>
                  <View style={styles.gridItem}>
                    <View style={styles.row}>
                      <Text style={styles.label}>KM:</Text>
                      <Text style={styles.value}>{trailer.trailer_kms ? `${trailer.trailer_kms} km` : 'Not set'}</Text>
                    </View>
                  </View>
                  {trailer.plant_number && (
                    <View style={styles.gridItem}>
                      <View style={styles.row}>
                        <Text style={styles.label}>Plant Number:</Text>
                        <Text style={styles.value}>{trailer.plant_number}</Text>
                      </View>
                    </View>
                  )}
                </View>
                
                {/* Electrical Tasks */}
                {trailer.electrical_tasks && trailer.electrical_tasks.length > 0 && (
                  <View>
                    <View style={styles.trailerSectionHeader}>
                      <Text style={styles.trailerSectionTitle}>Electrical System</Text>
                    </View>
                    <View style={styles.table}>
                      <View style={styles.tableHeader}>
                        <Text style={styles.tableCellMedium}>Name</Text>
                        <Text style={styles.tableCellLarge}>Task</Text>
                        <Text style={styles.tableCellMedium}>Remarks</Text>
                      </View>
                      {trailer.electrical_tasks.map((task, taskIndex) => (
                        <View key={taskIndex} style={styles.tableRow}>
                          <Text style={styles.tableCellMedium}>{task.name || '-'}</Text>
                          <Text style={styles.tableCellLarge}>{task.task || '-'}</Text>
                          <Text style={styles.tableCellMedium}>{task.remarks || '-'}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Tires and Wheels Tasks */}
                {trailer.tires_wheels_tasks && trailer.tires_wheels_tasks.length > 0 && (
                  <View>
                    <View style={styles.trailerSectionHeader}>
                      <Text style={styles.trailerSectionTitle}>Tires and Wheels</Text>
                    </View>
                    <View style={styles.table}>
                      <View style={styles.tableHeader}>
                        <Text style={styles.tableCellMedium}>Name</Text>
                        <Text style={styles.tableCellLarge}>Task</Text>
                        <Text style={styles.tableCellMedium}>Remarks</Text>
                      </View>
                      {trailer.tires_wheels_tasks.map((task, taskIndex) => (
                        <View key={taskIndex} style={styles.tableRow}>
                          <Text style={styles.tableCellMedium}>{task.name || '-'}</Text>
                          <Text style={styles.tableCellLarge}>{task.task || '-'}</Text>
                          <Text style={styles.tableCellMedium}>{task.remarks || '-'}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Brake System Tasks */}
                {trailer.brake_system_tasks && trailer.brake_system_tasks.length > 0 && (
                  <View>
                    <View style={styles.trailerSectionHeader}>
                      <Text style={styles.trailerSectionTitle}>Brake System</Text>
                    </View>
                    <View style={styles.table}>
                      <View style={styles.tableHeader}>
                        <Text style={styles.tableCellMedium}>Name</Text>
                        <Text style={styles.tableCellLarge}>Task</Text>
                        <Text style={styles.tableCellMedium}>Remarks</Text>
                      </View>
                      {trailer.brake_system_tasks.map((task, taskIndex) => (
                        <View key={taskIndex} style={styles.tableRow}>
                          <Text style={styles.tableCellMedium}>{task.name || '-'}</Text>
                          <Text style={styles.tableCellLarge}>{task.task || '-'}</Text>
                          <Text style={styles.tableCellMedium}>{task.remarks || '-'}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Suspension Tasks */}
                {trailer.suspension_tasks && trailer.suspension_tasks.length > 0 && (
                  <View>
                    <View style={styles.trailerSectionHeader}>
                      <Text style={styles.trailerSectionTitle}>Suspension</Text>
                    </View>
                    <View style={styles.table}>
                      <View style={styles.tableHeader}>
                        <Text style={styles.tableCellMedium}>Name</Text>
                        <Text style={styles.tableCellLarge}>Task</Text>
                        <Text style={styles.tableCellMedium}>Remarks</Text>
                      </View>
                      {trailer.suspension_tasks.map((task, taskIndex) => (
                        <View key={taskIndex} style={styles.tableRow}>
                          <Text style={styles.tableCellMedium}>{task.name || '-'}</Text>
                          <Text style={styles.tableCellLarge}>{task.task || '-'}</Text>
                          <Text style={styles.tableCellMedium}>{task.remarks || '-'}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Body/Chassis Tasks */}
                {trailer.body_chassis_tasks && trailer.body_chassis_tasks.length > 0 && (
                  <View>
                    <View style={styles.trailerSectionHeader}>
                      <Text style={styles.trailerSectionTitle}>Body/Chassis</Text>
                    </View>
                    <View style={styles.table}>
                      <View style={styles.tableHeader}>
                        <Text style={styles.tableCellMedium}>Name</Text>
                        <Text style={styles.tableCellLarge}>Task</Text>
                        <Text style={styles.tableCellMedium}>Remarks</Text>
                      </View>
                      {trailer.body_chassis_tasks.map((task, taskIndex) => (
                        <View key={taskIndex} style={styles.tableRow}>
                          <Text style={styles.tableCellMedium}>{task.name || '-'}</Text>
                          <Text style={styles.tableCellLarge}>{task.task || '-'}</Text>
                          <Text style={styles.tableCellMedium}>{task.remarks || '-'}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Other Task List */}
        {jobCard.other_progress && jobCard.other_progress.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Other Task List</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCellMedium}>Task Name</Text>
                <Text style={styles.tableCellLarge}>Description</Text>
                <Text style={styles.tableCellMedium}>Done By</Text>
                <Text style={styles.tableCellSmall}>Hours</Text>
              </View>
              {jobCard.other_progress.map((task, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCellMedium}>{task.task_name || '-'}</Text>
                  <Text style={styles.tableCellLarge}>{task.description || '-'}</Text>
                  <Text style={styles.tableCellMedium}>{task.done_by || '-'}</Text>
                  <Text style={styles.tableCellSmall}>{task.hours || '-'}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>

      {/* Third Page - Parts and Financial Information */}
      <Page size="A4" style={styles.page}>
        {/* Parts Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parts Information</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Invoice Number:</Text>
                <Text style={styles.value}>{jobCard.invoice_number || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Part Location:</Text>
                <Text style={styles.value}>{jobCard.part_location || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Invoice Date:</Text>
                <Text style={styles.value}>{formatDate(jobCard.invoice_date)}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Invoice Value:</Text>
                <Text style={styles.value}>{formatCurrency(jobCard.invoice_value)}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Issue Counter Sale:</Text>
                <Text style={styles.value}>{jobCard.issue_counter_sale || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Parts and Consumables */}
        {jobCard.parts_and_consumables && jobCard.parts_and_consumables.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Parts and Consumables</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCellMedium}>Part Number</Text>
                <Text style={styles.tableCellLarge}>Description</Text>
                <Text style={styles.tableCellSmall}>Price</Text>
                <Text style={styles.tableCellSmall}>Qty</Text>
                <Text style={styles.tableCellSmall}>Total</Text>
                <Text style={styles.tableCellMedium}>Supplier</Text>
                <Text style={styles.tableCellMedium}>Remarks</Text>
              </View>
              {jobCard.parts_and_consumables.map((part, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCellMedium}>{part.part_number || '-'}</Text>
                  <Text style={styles.tableCellLarge}>{part.description || '-'}</Text>
                  <Text style={styles.tableCellSmall}>{formatCurrency(part.price_aud)}</Text>
                  <Text style={styles.tableCellSmall}>{part.qty_used || '-'}</Text>
                  <Text style={styles.tableCellSmall}>{formatCurrency(part.total_cost_aud)}</Text>
                  <Text style={styles.tableCellMedium}>{part.supplier || '-'}</Text>
                  <Text style={styles.tableCellMedium}>{part.remarks || '-'}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Parts and Consumables</Text>
            <Text style={styles.noDataText}>No parts and consumables recorded</Text>
          </View>
        )}

        {/* Lubricants Used */}
        {jobCard.lubricants_used && jobCard.lubricants_used.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lubricants Used</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.lubricantTaskCell}>Task</Text>
                <Text style={styles.lubricantGradeCell}>Grade</Text>
                <Text style={styles.lubricantQtyCell}>Qty</Text>
                <Text style={styles.lubricantCostCell}>Cost/L</Text>
                <Text style={styles.lubricantTotalCell}>Total</Text>
                <Text style={styles.lubricantRemarksCell}>Remarks</Text>
              </View>
              {jobCard.lubricants_used.map((lubricant, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.lubricantTaskCell}>{lubricant.task_name || '-'}</Text>
                  <Text style={styles.lubricantGradeCell}>{lubricant.grade || '-'}</Text>
                  <Text style={styles.lubricantQtyCell}>{lubricant.qty || '-'}</Text>
                  <Text style={styles.lubricantCostCell}>{formatCurrency(lubricant.cost_per_litre)}</Text>
                  <Text style={styles.lubricantTotalCell}>{formatCurrency(lubricant.total_cost)}</Text>
                  <Text style={styles.lubricantRemarksCell}>{lubricant.remarks || '-'}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lubricants Used</Text>
            <Text style={styles.noDataText}>No lubricants recorded</Text>
          </View>
        )}

        {/* Cost Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cost Summary</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Total A (Labor):</Text>
                <Text style={styles.totalValue}>{formatCurrency(jobCard.total_a)}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Total B (Parts):</Text>
                <Text style={styles.totalValue}>{formatCurrency(totalB)}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Total C (Lubricants):</Text>
                <Text style={styles.totalValue}>{formatCurrency(jobCard.total_c)}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <View style={[styles.totalBox, { backgroundColor: '#fef3c7' }]}>
                <Text style={[styles.totalLabel, { color: '#92400e' }]}>Grand Total:</Text>
                <Text style={[styles.totalValue, { color: '#92400e' }]}>
                  {formatCurrency((jobCard.total_a || 0) + totalB + (jobCard.total_c || 0))}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Status:</Text>
            <Text style={styles.value}>{jobCard.payment_status === 'paid' ? 'Paid' : 'Unpaid'}</Text>
          </View>
        </View>

        {/* Mechanic Section Information */}
        {(jobCard.handover_valuables_to_customer || jobCard.check_all_tyres || jobCard.future_work_notes) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mechanic Notes</Text>
            {jobCard.handover_valuables_to_customer && (
              <View style={styles.row}>
                <Text style={styles.label}>Handover Valuables:</Text>
                <Text style={styles.value}>{jobCard.handover_valuables_to_customer}</Text>
              </View>
            )}
            {jobCard.check_all_tyres && (
              <View style={styles.row}>
                <Text style={styles.label}>Tyre Check:</Text>
                <Text style={styles.value}>{jobCard.check_all_tyres}</Text>
              </View>
            )}
            {jobCard.future_work_notes && (
              <View style={styles.row}>
                <Text style={styles.label}>Future Work:</Text>
                <Text style={styles.value}>{jobCard.future_work_notes}</Text>
              </View>
            )}
          </View>
        )}
      </Page>

      {/* Fourth Page - Images and Signatures */}
      {(jobCard.image_front || jobCard.image_back || jobCard.image_left_side || jobCard.image_right_side || 
        jobCard.customer_signature || jobCard.supervisor_signature) && (
        <Page size="A4" style={styles.page}>
          {/* Vehicle Images */}
          {(jobCard.image_front || jobCard.image_back || jobCard.image_left_side || jobCard.image_right_side) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vehicle Images</Text>
              <View style={styles.imageGrid}>
                {jobCard.image_front && (
                  <View style={styles.imageItem}>
                    <Text style={styles.imageLabel}>Front View</Text>
                    <Image style={styles.image} src={jobCard.image_front} />
                  </View>
                )}
                {jobCard.image_back && (
                  <View style={styles.imageItem}>
                    <Text style={styles.imageLabel}>Back View</Text>
                    <Image style={styles.image} src={jobCard.image_back} />
                  </View>
                )}
                {jobCard.image_left_side && (
                  <View style={styles.imageItem}>
                    <Text style={styles.imageLabel}>Left Side</Text>
                    <Image style={styles.image} src={jobCard.image_left_side} />
                  </View>
                )}
                {jobCard.image_right_side && (
                  <View style={styles.imageItem}>
                    <Text style={styles.imageLabel}>Right Side</Text>
                    <Image style={styles.image} src={jobCard.image_right_side} />
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Signatures */}
          {(jobCard.customer_signature || jobCard.supervisor_signature) && (
            <View style={styles.signatureContainer}>
              {jobCard.customer_signature && (
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureLabel}>Customer Signature</Text>
                  <Image style={styles.signatureImage} src={jobCard.customer_signature} />
                </View>
              )}
              {jobCard.supervisor_signature && (
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureLabel}>Supervisor Signature</Text>
                  <Image style={styles.signatureImage} src={jobCard.supervisor_signature} />
                </View>
              )}
            </View>
          )}

          {/* Footer */}
          <View style={{ marginTop: 'auto', paddingTop: 20, borderTop: 1, borderTopColor: '#e5e7eb' }}>
            <Text style={{ fontSize: 8, color: '#6b7280', textAlign: 'center' }}>
              Generated on {new Date().toLocaleDateString('en-AU')} by AutoAgri Australia Job Card Management System - Designed by Monarc Labs
            </Text>
          </View>
        </Page>
      )}
    </Document>
  );
};