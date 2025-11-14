select count(*),lead_status from user_sts group by lead_status


SELECT DATE_FORMAT(wo.created_date, '%Y-%m') AS month_group, COUNT(DISTINCT us.lead_id) AS total_leads, COUNT(DISTINCT wo.work_order_id) AS total_booked, SUM(wo.total_amount) AS total_amount_received FROM user_sts us LEFT JOIN flapone_workorder wo ON us.agent_id = wo.agent_id GROUP BY month_group ORDER BY month_group


SELECT 
    DATE_FORMAT(wo.created_date, '%Y-%m-%d') AS day_group,
    COUNT(DISTINCT us.lead_id) AS total_leads,
    COUNT(DISTINCT wo.work_order_id) AS total_booked,
    SUM(wo.total_amount) AS total_amount_received,
    COUNT(DISTINCT CASE WHEN wo.payment_status = 'paid' THEN wo.work_order_id END) AS total_paid_booked,
    COUNT(DISTINCT CASE WHEN wo.payment_status = 'unpaid' THEN wo.work_order_id END) AS total_unpaid_booked
FROM user_sts us
LEFT JOIN workorder wo ON us.agent_id = wo.agent_id
WHERE DATE_FORMAT(wo.created_date, '%Y-%m') = '2024-07'  -- Replace with your desired month (e.g., '2024-07' for July 2024)
GROUP BY day_group
ORDER BY day_group;

SELECT DATE_FORMAT(t1.sts_date, '%Y-%m') AS month_group,COUNT(DISTINCT t1.lead_id,t1.agent_id,t1.user_id,t1.sts_date) AS total_leads, COUNT(DISTINCT CASE WHEN t1.lead_status = 'booked' THEN t1.id END) AS total_booked,COUNT(DISTINCT CASE WHEN t1.lead_status = 'followup' THEN t1.id END) AS total_followup,COUNT(DISTINCT CASE WHEN t1.lead_status = 'hot' THEN t1.id END) AS total_hot,COUNT(DISTINCT CASE WHEN t1.lead_status = 'no_response' THEN t1.id END) AS total_no_response,COUNT(DISTINCT CASE WHEN t1.lead_status = 'junk' THEN t1.id END) AS total_junk FROM user_sts t1 left join flapone_user_extra_info t4 on t1.agent_id=t4.flapone_agent_id and t1.lead_id=t4.enq_id JOIN flapone_user t3 ON t1.user_id=t3.user_id Where (t1.agent_id IN (39,40,41,42,43,44,45,46,47)) GROUP BY month_group ORDER BY month_group DESC


