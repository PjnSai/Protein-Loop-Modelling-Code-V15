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
        return create_error_response('Failed to update profile', 500)

@require_auth
def get_user_logs():
    """Get the current user's activity logs, newest first, with pagination"""
    try:
        user = User.query.get(session.get('user_id'))
        if not user:
            return create_error_response('User not found', 404)

        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)

        logs_query = LoginLog.query.filter_by(email=user.email).order_by(LoginLog.timestamp.desc())
        total_count = logs_query.count()
        logs = logs_query.offset((page - 1) * per_page).limit(per_page).all()

        # Timestamps are stored as Unix time (seconds)
        logs_list = [{
            'id': log.id,
            'action': log.action or 'unknown',
            'status': log.status or 'unknown',
            'ip': log.ip or 'unknown',
            'timestamp': log.timestamp or 0,
            'date_formatted': datetime.datetime.fromtimestamp(log.timestamp).strftime('%Y-%m-%d %H:%M:%S') if log.timestamp else 'Unknown',
            'email': log.email or user.email
        } for log in logs]

        total_pages = (total_count + per_page - 1) // per_page

        return jsonify({
            'logs': logs_list,
            'page': page,
            'pages': total_pages,
            'per_page': per_page,
            'total': total_count,
            'has_next': page < total_pages,
            'has_prev': page > 1,
            'debug_info': {
                'user_email': user.email,
                'query_count': total_count,
                'returned_count': len(logs_list),
                'processing_success': True
            }
        })

    except Exception as e:
        logger.error(f"Error fetching logs: {e}")
        return create_error_response('Failed to fetch logs', 500)

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