# profile_routes.py - User Profile Management System
from flask import request, jsonify, session
from utils import require_auth
from models import User, LoginLog
from extensions import db
import datetime, time 
from modelling_utils import create_error_response
from logging_config import logger

@require_auth
def get_profile():
    """Get User Profile Information Endpoint"""
    user = User.query.get(session['user_id'])
    
    profile_data = {
        'email': user.email,
        'first_name': getattr(user, 'first_name', '') or '',
        'last_name': getattr(user, 'last_name', '') or '',
        'institution': getattr(user, 'institution', '') or '',
        'bio': getattr(user, 'bio', '') or '',
    }
    
    return jsonify(profile_data), 200

@require_auth
def update_profile():
    """Update User Profile Information Endpoint"""
    try:
        data = request.json or {}
        
        user = User.query.get(session['user_id'])
        
        if not user:
            return create_error_response('User not found', 404)
        
        # Update user profile fields with fallback to existing values
        user.first_name = data.get('first_name', user.first_name or '')
        user.last_name = data.get('last_name', user.last_name or '')
        user.institution = data.get('institution', user.institution or '')
        user.bio = data.get('bio', user.bio or '')
        
        db.session.commit()
        
        # Return updated profile data for frontend
        updated_profile = {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'institution': user.institution,
            'bio': user.bio,
        }
        
        return jsonify({
            'message': 'Profile updated successfully',
            'profile': updated_profile
        }), 200
        
    except Exception as e:
        logger.error(f"Profile update error: {e}")
        db.session.rollback()
        return create_error_response(f'Failed to update profile: {str(e)}', 500)

@require_auth
def get_user_logs():
    """Get User Activity Logs with Pagination and Timestamp"""
    try:
        user_id = session.get('user_id')
        user = User.query.get(user_id)
        
        if not user:
            return create_error_response('User not found', 404)
        
        # Parse pagination parameters with validation
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)

        logger.info(f"Fetching logs for user: {user.email}, page: {page}")
        
        # Query logs for this user with ordering
        logs_query = LoginLog.query.filter_by(email=user.email).order_by(LoginLog.timestamp.desc())
        total_count = logs_query.count()
        
        logger.info(f"Total logs found: {total_count}")
        
        # Get paginated results efficiently
        offset = (page - 1) * per_page
        logs = logs_query.offset(offset).limit(per_page).all()
        
        logger.info(f"Retrieved {len(logs)} raw log entries")
        
        # Convert to JSON format with robust timestamp handling
        logs_list = []
        for i, log in enumerate(logs):
            try:
                logger.debug(f"Processing log {i+1}: ID={log.id}, timestamp={log.timestamp}")
                
                # Robust timestamp conversion handling multiple formats
                timestamp_value = 0
                formatted_date = 'Unknown'
                
                if log.timestamp is not None:
                    try:
                        if isinstance(log.timestamp, (int, float)):
                            # It's a Unix timestamp
                            timestamp_value = float(log.timestamp)
                            formatted_date = datetime.datetime.fromtimestamp(timestamp_value).strftime('%Y-%m-%d %H:%M:%S')
                        elif hasattr(log.timestamp, 'timestamp'):
                            # It's a datetime object
                            timestamp_value = log.timestamp.timestamp()
                            formatted_date = log.timestamp.strftime('%Y-%m-%d %H:%M:%S')
                        elif hasattr(log.timestamp, 'strftime'):
                            # It's some other datetime-like object
                            formatted_date = log.timestamp.strftime('%Y-%m-%d %H:%M:%S')
                            timestamp_value = time.mktime(log.timestamp.timetuple())
                        else:
                            # Try converting string to float
                            timestamp_value = float(str(log.timestamp))
                            formatted_date = datetime.datetime.fromtimestamp(timestamp_value).strftime('%Y-%m-%d %H:%M:%S')
                            # Use fallback values but don't skip the entry
                    except (ValueError, TypeError, OSError) as ts_error:
                        logger.warning(f"Timestamp conversion error for log {log.id}: {ts_error}")
                        timestamp_value = 0
                        formatted_date = f'Invalid timestamp: {log.timestamp}'
                
                # Create log entry with safe value handling
                log_entry = {
                    'id': log.id or i,
                    'action': str(log.action) if log.action else 'unknown',
                    'status': str(log.status) if log.status else 'unknown', 
                    'ip': str(log.ip) if log.ip else 'unknown',
                    'timestamp': timestamp_value,
                    'date_formatted': formatted_date,
                    'email': str(log.email) if log.email else str(user.email)
                }
                
                logs_list.append(log_entry)
                logger.debug(f"Successfully processed log {i+1}")
                
            except Exception as log_error:
                logger.error(f"Error processing log entry {log.id}: {log_error}")
                # Add placeholder entry so we don't lose the log completely
                logs_list.append({
                    'id': getattr(log, 'id', i),
                    'action': 'error',
                    'status': 'processing_error',
                    'ip': 'unknown',
                    'timestamp': 0,
                    'date_formatted': f'Error: {str(log_error)[:50]}',
                    'email': str(user.email)
                })
                continue
        
        # Calculate pagination metadata
        total_pages = (total_count + per_page - 1) // per_page
        has_next = page < total_pages
        has_prev = page > 1
        
        response_data = {
            'logs': logs_list,
            'page': page,
            'pages': total_pages,
            'per_page': per_page,
            'total': total_count,
            'has_next': has_next,
            'has_prev': has_prev,
            'debug_info': {
                'user_email': user.email,
                'query_count': total_count,
                'returned_count': len(logs_list),
                'processing_success': True
            }
        }
        
        logger.info(f"Successfully returning {len(logs_list)} logs out of {total_count} total")
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Error in get_user_logs: {e}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'error': f'Failed to fetch logs: {str(e)}',
            'logs': [],
            'page': 1,
            'pages': 0,
            'per_page': 20,
            'total': 0,
            'has_next': False,
            'has_prev': False
        }), 500

@require_auth
def delete_user_logs():
    """Delete login logs for the current user with optional date filter"""
    try:
        data = request.get_json() or {}
        days_old = data.get('days_old', None)  # Optional parameter
        
        user_id = session.get('user_id')
        user = User.query.get(user_id)
        
        if not user:
            return create_error_response('User not found', 404)
        
        # Build deletion query for user's logs
        query = LoginLog.query.filter_by(email=user.email)
        
        # Apply date filter if specified
        if days_old:
            # Calculate cutoff timestamp (days_old days ago)
            cutoff_time = time.time() - (int(days_old) * 24 * 60 * 60)
            query = query.filter(LoginLog.timestamp < cutoff_time)
        
        # Count logs before deletion for reporting
        count_to_delete = query.count()
        
        # Perform bulk deletion
        deleted_count = query.delete()
        db.session.commit()
        
        # Construct success message with details
        message = f'Successfully deleted {deleted_count} login logs'
        if days_old:
            message += f' older than {days_old} days'
        else:
            message += ' (all logs cleared)'
            
        logger.info(f"Deleted {deleted_count} login logs for user {user.email}")
        
        return jsonify({
            'message': message,
            'deleted_count': deleted_count
        })
        
    except Exception as e:
        logger.error(f"Delete user logs error: {e}")
        db.session.rollback()
        return create_error_response('Failed to delete logs', 500)